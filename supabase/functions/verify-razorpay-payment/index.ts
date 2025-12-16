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
    const { payment_token_id, payment_id, status, dbOrderId } = await req.json();
    
    const zwitchSecretKey = Deno.env.get('ZWITCH_SECRET_KEY');
    
    if (!zwitchSecretKey) {
      throw new Error('Zwitch credentials not configured');
    }

    console.log('Verifying Zwitch payment:', { payment_token_id, payment_id, status });

    // Verify payment status from Zwitch API
    const statusResponse = await fetch(
      `https://api.zwitch.io/v1/payment_token/${payment_token_id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + zwitchSecretKey,
        },
      }
    );

    if (!statusResponse.ok) {
      const error = await statusResponse.text();
      console.error('Zwitch status check failed:', error);
      throw new Error('Failed to verify payment status');
    }

    const paymentData = await statusResponse.json();
    console.log('Zwitch payment data:', paymentData);
    
    if (paymentData.status !== 'captured') {
      throw new Error('Payment not captured');
    }

    // Update order in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        razorpay_payment_id: payment_id,
        payment_status: 'completed',
        status: 'confirmed',
      })
      .eq('id', dbOrderId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error('Failed to update order status');
    }

    // Deduct inventory now that payment is confirmed
    const { data: deductResult, error: deductError } = await supabase
      .rpc('deduct_order_inventory', {
        p_order_id: dbOrderId,
      });

    if (deductError) {
      console.error('Error deducting inventory:', deductError);
      // Log error but don't fail payment verification
      // Inventory can be manually adjusted if needed
    } else if (deductResult && !(deductResult as any).success) {
      console.warn('Inventory deduction had issues:', deductResult);
    } else {
      console.log('Inventory deducted successfully for order:', dbOrderId);
    }

    console.log('Payment verified successfully for order:', dbOrderId);

    return new Response(
      JSON.stringify({ success: true, message: 'Payment verified successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in verify-razorpay-payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
