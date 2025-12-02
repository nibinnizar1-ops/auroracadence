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
    const { amount, currency, customerInfo, items } = await req.json();
    
    const zwitchAccessKey = Deno.env.get('ZWITCH_ACCESS_KEY');
    const zwitchSecretKey = Deno.env.get('ZWITCH_SECRET_KEY');
    
    if (!zwitchAccessKey || !zwitchSecretKey) {
      throw new Error('Zwitch credentials not configured');
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
        amount: amount / 100, // Zwitch expects amount in rupees, not paise
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
    
    // Create order in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: dbOrder, error: dbError } = await supabase
      .from('orders')
      .insert({
        order_number: mtx,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
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
        subtotal: amount / 100,
        total: amount / 100,
        currency: currency || 'INR',
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

    console.log('Zwitch payment token created:', zwitchPayment.id);

    return new Response(
      JSON.stringify({
        paymentToken: zwitchPayment.id,
        accessKey: zwitchAccessKey,
        amount: amount / 100,
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
