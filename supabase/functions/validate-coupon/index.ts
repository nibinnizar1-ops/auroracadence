import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidateCouponRequest {
  code: string;
  cartTotal: number;
  userId?: string;
  cartItems?: Array<{
    product_id?: string;
    category_id?: string;
    collection_id?: string;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, cartTotal, userId, cartItems = [] }: ValidateCouponRequest = await req.json();

    if (!code || !cartTotal) {
      return new Response(
        JSON.stringify({ error: 'Code and cartTotal are required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Normalize code
    const normalizedCode = code.trim().toUpperCase();

    // Fetch coupon
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (couponError || !coupon) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid coupon code',
          discount: 0,
          finalTotal: cartTotal
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if coupon is active
    if (!coupon.is_active) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'This coupon is not active',
          discount: 0,
          finalTotal: cartTotal
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if coupon is paused
    if (coupon.is_paused) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'This coupon is currently paused',
          discount: 0,
          finalTotal: cartTotal
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check date validity
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);

    if (now < validFrom) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'This coupon is not yet valid',
          discount: 0,
          finalTotal: cartTotal
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (now > validUntil) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'This coupon has expired',
          discount: 0,
          finalTotal: cartTotal
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check minimum order amount
    if (coupon.minimum_order_amount && cartTotal < coupon.minimum_order_amount) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: `Minimum order amount of ₹${coupon.minimum_order_amount} required`,
          discount: 0,
          finalTotal: cartTotal
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check usage limits (max_uses)
    if (coupon.max_uses !== null) {
      const { count } = await supabase
        .from('coupon_usage')
        .select('*', { count: 'exact', head: true })
        .eq('coupon_id', coupon.id);

      if (count !== null && count >= coupon.max_uses) {
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'This coupon has reached its usage limit',
            discount: 0,
            finalTotal: cartTotal
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Check user limit (max_uses_per_user) if user is logged in
    if (userId && coupon.max_uses_per_user) {
      const { count } = await supabase
        .from('coupon_usage')
        .select('*', { count: 'exact', head: true })
        .eq('coupon_id', coupon.id)
        .eq('user_id', userId);

      if (count !== null && count >= coupon.max_uses_per_user) {
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'You have already used this coupon the maximum number of times',
            discount: 0,
            finalTotal: cartTotal
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Check applicability (categories/products/collections)
    if (coupon.applicable_to !== 'all' && coupon.applicable_ids) {
      const applicableIds = coupon.applicable_ids as string[];
      let isApplicable = false;

      if (coupon.applicable_to === 'categories') {
        // Check if any cart item belongs to applicable categories
        // This would require checking category_products table
        // For now, we'll allow it and validate at order creation
        isApplicable = true; // Simplified - can be enhanced
      } else if (coupon.applicable_to === 'products') {
        // Check if any cart item is in applicable products
        isApplicable = cartItems.some(item => 
          item.product_id && applicableIds.includes(item.product_id)
        );
      } else if (coupon.applicable_to === 'collections') {
        // Check if any cart item belongs to applicable collections
        // This would require checking collection_products table
        isApplicable = true; // Simplified - can be enhanced
      }

      if (!isApplicable) {
        return new Response(
          JSON.stringify({ 
            valid: false, 
            error: 'This coupon is not applicable to items in your cart',
            discount: 0,
            finalTotal: cartTotal
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (cartTotal * coupon.discount_value) / 100;
    } else {
      // fixed_amount
      discount = coupon.discount_value;
    }

    // Ensure discount doesn't exceed cart total
    discount = Math.min(discount, cartTotal);
    const finalTotal = Math.max(0, cartTotal - discount);

    return new Response(
      JSON.stringify({
        valid: true,
        discount: parseFloat(discount.toFixed(2)),
        finalTotal: parseFloat(finalTotal.toFixed(2)),
        coupon: {
          id: coupon.id,
          code: coupon.code,
          name: coupon.name,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
        },
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error validating coupon:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred while validating the coupon',
        valid: false,
        discount: 0,
        finalTotal: 0
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

