import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency, customerInfo, items, userId, couponCode } = await req.json();
    
    const zwitchAccessKey = Deno.env.get('ZWITCH_ACCESS_KEY');
    const zwitchSecretKey = Deno.env.get('ZWITCH_SECRET_KEY');
    
    if (!zwitchAccessKey || !zwitchSecretKey) {
      throw new Error('Zwitch credentials not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate coupon if provided (server-side final validation)
    let couponId: string | null = null;
    let discountAmount = 0;
    let orderSubtotal = amount / 100; // Amount is in paise, convert to rupees
    let orderTotal = orderSubtotal;

    if (couponCode) {
      try {
        // Call validate-coupon function for final server-side validation
        const validateResponse = await fetch(`${supabaseUrl}/functions/v1/validate-coupon`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            code: couponCode,
            cartTotal: orderSubtotal,
            userId: userId || null,
            cartItems: items.map((item: any) => ({
              product_id: item.id,
            })),
          }),
        });

        if (validateResponse.ok) {
          const validationResult = await validateResponse.json();
          if (validationResult.valid && validationResult.coupon) {
            couponId = validationResult.coupon.id;
            discountAmount = validationResult.discount;
            orderTotal = validationResult.finalTotal;
          } else {
            // Coupon invalid - log but continue without coupon
            console.warn('Coupon validation failed:', validationResult.error);
          }
        }
      } catch (error) {
        console.error('Error validating coupon:', error);
        // Continue without coupon if validation fails
      }
    }

    const mtx = `MTX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create Zwitch payment token
    const tokenResponse = await fetch('https://api.zwitch.io/v1/payment_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + zwitchSecretKey,
      },
      body: JSON.stringify({
        amount: orderTotal, // Use order total after discount
        currency: currency || 'INR',
        contact_number: customerInfo.phone,
        email_id: customerInfo.email,
        mtx: mtx,
        udf: {
          customer_name: customerInfo.name,
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          pincode: customerInfo.pincode,
        }
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Zwitch payment token creation failed:', error);
      throw new Error('Failed to create Zwitch payment token');
    }

    const zwitchPayment = await tokenResponse.json();
    
    // Validate inventory before creating order
    const inventoryErrors: string[] = [];
    for (const item of items) {
      if (item.variantId) {
        const { data: inventoryCheck, error: checkError } = await supabase
          .rpc('check_inventory_availability', {
            p_variant_id: item.variantId,
            p_requested_quantity: item.quantity,
          });

        if (checkError || !inventoryCheck?.available) {
          inventoryErrors.push(
            `${item.title || 'Item'}: ${inventoryCheck?.error || 'Stock unavailable'}`
          );
        }
      }
    }

    if (inventoryErrors.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Insufficient stock',
          details: inventoryErrors 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create order in database
    const { data: dbOrder, error: dbError } = await supabase
      .from('orders')
      .insert({
        order_number: mtx,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        user_id: userId || null, // Link to user if logged in
        shipping_address: {
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          pincode: customerInfo.pincode,
        },
        billing_address: {
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          pincode: customerInfo.pincode,
        },
        items,
        subtotal: orderSubtotal,
        total: orderTotal,
        currency: currency || 'INR',
        coupon_id: couponId,
        discount_amount: discountAmount,
        razorpay_order_id: zwitchPayment.id,
        payment_method: 'zwitch',
        payment_status: 'pending',
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to create order in database');
    }

    // Create order line items for inventory tracking
    const orderLineItems = items.map((item: any) => ({
      order_id: dbOrder.id,
      product_id: item.id || null,
      variant_id: item.variantId || null,
      quantity: item.quantity,
      price: parseFloat(item.price) || 0,
      title: item.title || 'Product',
      variant_title: item.variantTitle || null,
    }));

    const { error: lineItemsError } = await supabase
      .from('order_line_items')
      .insert(orderLineItems);

    if (lineItemsError) {
      console.error('Error creating order line items:', lineItemsError);
      // Don't fail the order creation, but log the error
    }

    // Record coupon usage if coupon was applied
    if (couponId && discountAmount > 0) {
      await supabase
        .from('coupon_usage')
        .insert({
          coupon_id: couponId,
          order_id: dbOrder.id,
          user_id: userId || null,
          discount_amount: discountAmount,
          order_total_before_discount: orderSubtotal,
          order_total_after_discount: orderTotal,
        });
    }

    console.log('Zwitch payment token created:', zwitchPayment.id);

    return new Response(
      JSON.stringify({
        paymentToken: zwitchPayment.id,
        accessKey: zwitchAccessKey,
        amount: orderTotal,
        currency: currency || 'INR',
        mtx: mtx,
        dbOrderId: dbOrder.id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in create-razorpay-order:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
