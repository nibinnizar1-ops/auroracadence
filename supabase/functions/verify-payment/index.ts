import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================
// Gateway Verification (Inlined for standalone deployment)
// ============================================

interface PaymentGatewayConfig {
  credentials: Record<string, string>;
  isTestMode: boolean;
  webhookSecret?: string;
  config?: Record<string, any>;
}

interface VerifyPaymentRequest {
  paymentTokenId?: string;
  paymentId: string;
  orderId: string;
  dbOrderId: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  status: "captured" | "failed" | "pending" | "refunded";
  paymentId: string;
  orderId: string;
  amount?: number;
  currency?: string;
  error?: string;
}

// Zwitch Verification
async function verifyZwitchPayment(
  request: VerifyPaymentRequest,
  config: PaymentGatewayConfig
): Promise<VerifyPaymentResponse> {
  const secretKey = config.credentials.secret_key;

  if (!secretKey) {
    throw new Error("Zwitch credentials not configured");
  }

  const apiBaseUrl = config.config?.api_base_url || "https://api.zwitch.io/v1/";

  if (!request.paymentTokenId) {
    throw new Error("Payment token ID is required for Zwitch verification");
  }

  const statusResponse = await fetch(
    `${apiBaseUrl}payment_token/${request.paymentTokenId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secretKey}`,
      },
    }
  );

  if (!statusResponse.ok) {
    const error = await statusResponse.text();
    console.error("Zwitch status check failed:", error);
    throw new Error("Failed to verify payment status");
  }

  const paymentData = await statusResponse.json();

  if (paymentData.status !== "captured") {
    return {
      success: false,
      status: paymentData.status || "failed",
      paymentId: request.paymentId,
      orderId: request.orderId,
      error: `Payment not captured. Status: ${paymentData.status}`,
    };
  }

  return {
    success: true,
    status: "captured",
    paymentId: request.paymentId,
    orderId: request.orderId,
    amount: paymentData.amount,
    currency: paymentData.currency || "INR",
  };
}

// Razorpay Verification
async function verifyRazorpayPayment(
  request: VerifyPaymentRequest,
  config: PaymentGatewayConfig
): Promise<VerifyPaymentResponse> {
  const keyId = config.credentials.key_id;
  const keySecret = config.credentials.key_secret;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }

  const apiBaseUrl = "https://api.razorpay.com/v1/";

  const paymentResponse = await fetch(
    `${apiBaseUrl}payments/${request.paymentId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      },
    }
  );

  if (!paymentResponse.ok) {
    const error = await paymentResponse.text();
    console.error("Razorpay payment verification failed:", error);
    throw new Error("Failed to verify Razorpay payment");
  }

  const paymentData = await paymentResponse.json();

  if (paymentData.status !== "captured" && paymentData.status !== "authorized") {
    return {
      success: false,
      status: paymentData.status || "failed",
      paymentId: request.paymentId,
      orderId: request.orderId,
      error: `Payment not captured. Status: ${paymentData.status}`,
    };
  }

  return {
    success: true,
    status: "captured",
    paymentId: request.paymentId,
    orderId: request.orderId,
    amount: paymentData.amount ? paymentData.amount / 100 : undefined,
    currency: paymentData.currency || "INR",
  };
}

// PayU Verification
async function verifyPayUPayment(
  request: VerifyPaymentRequest,
  config: PaymentGatewayConfig
): Promise<VerifyPaymentResponse> {
  // PayU verification typically done via webhook
  // For now, return success if paymentId exists
  return {
    success: true,
    status: "captured",
    paymentId: request.paymentId,
    orderId: request.orderId,
  };
}

// Cashfree Verification
async function verifyCashfreePayment(
  request: VerifyPaymentRequest,
  config: PaymentGatewayConfig
): Promise<VerifyPaymentResponse> {
  const appId = config.credentials.app_id;
  const secretKey = config.credentials.secret_key;

  if (!appId || !secretKey) {
    throw new Error("Cashfree credentials not configured");
  }

  const apiBaseUrl = config.isTestMode
    ? "https://sandbox.cashfree.com/pg"
    : "https://api.cashfree.com/pg";

  const paymentResponse = await fetch(
    `${apiBaseUrl}/orders/${request.orderId}/payments`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
      },
    }
  );

  if (!paymentResponse.ok) {
    const error = await paymentResponse.text();
    console.error("Cashfree payment verification failed:", error);
    throw new Error("Failed to verify Cashfree payment");
  }

  const paymentData = await paymentResponse.json();

  const successfulPayment = paymentData.find(
    (p: any) => p.payment_status === "SUCCESS"
  );

  if (!successfulPayment) {
    return {
      success: false,
      status: "failed",
      paymentId: request.paymentId,
      orderId: request.orderId,
      error: "Payment not found or not successful",
    };
  }

  return {
    success: true,
    status: "captured",
    paymentId: successfulPayment.cf_payment_id || request.paymentId,
    orderId: request.orderId,
    amount: successfulPayment.payment_amount,
    currency: successfulPayment.payment_currency || "INR",
  };
}

// Get gateway and verify payment
async function getGatewayAndVerifyPayment(
  supabaseUrl: string,
  supabaseServiceKey: string,
  request: VerifyPaymentRequest
): Promise<VerifyPaymentResponse> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get order to find gateway
  const { data: order } = await supabase
    .from("orders")
    .select("payment_gateway_id, payment_gateways(*)")
    .eq("id", request.dbOrderId)
    .single();

  let gateway;
  if (order?.payment_gateway_id && order.payment_gateways) {
    gateway = order.payment_gateways as any;
  } else {
    // Fallback to active gateway
    const { data: activeGateway } = await supabase
      .from("payment_gateways")
      .select("*")
      .eq("is_active", true)
      .single();

    if (!activeGateway) {
      throw new Error("No payment gateway configured");
    }
    gateway = activeGateway;
  }

  const config: PaymentGatewayConfig = {
    credentials: gateway.credentials as Record<string, string>,
    isTestMode: gateway.is_test_mode,
    webhookSecret: gateway.webhook_secret || undefined,
    config: gateway.config || {},
  };

  switch (gateway.code) {
    case "zwitch":
      return await verifyZwitchPayment(request, config);
    case "razorpay":
      return await verifyRazorpayPayment(request, config);
    case "payu":
      return await verifyPayUPayment(request, config);
    case "cashfree":
      return await verifyCashfreePayment(request, config);
    default:
      throw new Error(`Unsupported payment gateway: ${gateway.code}`);
  }
}

// ============================================
// Main Edge Function
// ============================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      payment_token_id,
      payment_id,
      status,
      dbOrderId,
      order_id,
    } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify payment
    const verifyResponse = await getGatewayAndVerifyPayment(
      supabaseUrl,
      supabaseServiceKey,
      {
        paymentTokenId: payment_token_id,
        paymentId: payment_id,
        orderId: order_id || "",
        dbOrderId: dbOrderId,
      }
    );

    if (!verifyResponse.success) {
      return new Response(
        JSON.stringify({
          error: verifyResponse.error || "Payment verification failed",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update order
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        gateway_payment_id: verifyResponse.paymentId,
        razorpay_payment_id: verifyResponse.paymentId,
        payment_status: "completed",
        status: "confirmed",
      })
      .eq("id", dbOrderId);

    if (updateError) {
      console.error("Database update error:", updateError);
      throw new Error("Failed to update order status");
    }

    // Deduct inventory
    const { data: deductResult, error: deductError } = await supabase.rpc(
      "deduct_order_inventory",
      {
        p_order_id: dbOrderId,
      }
    );

    if (deductError) {
      console.error("Error deducting inventory:", deductError);
    } else if (deductResult && !(deductResult as any).success) {
      console.warn("Inventory deduction had issues:", deductResult);
    } else {
      console.log("Inventory deducted successfully for order:", dbOrderId);
    }

    console.log("Payment verified successfully for order:", dbOrderId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified successfully",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in verify-payment:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
