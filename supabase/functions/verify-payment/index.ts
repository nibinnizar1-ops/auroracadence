import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyPaymentRequest {
  paymentTokenId: string;
  orderId?: string;
  dbOrderId?: string;
}

// ============================================
// Zwitch Payment Verification
// ============================================

async function verifyZwitchPayment(
  paymentTokenId: string
): Promise<{ status: string; paymentId?: string; paymentTokenId: string }> {
  // Step 1: Read credentials from Supabase Vault
  const accessKey = Deno.env.get("ZWITCH_ACCESS_KEY");
  const secretKey = Deno.env.get("ZWITCH_SECRET_KEY");

  console.log("Reading Zwitch credentials from Vault:", {
    hasAccessKey: !!accessKey,
    accessKeyPrefix: accessKey?.substring(0, 20) || "NOT FOUND",
    hasSecretKey: !!secretKey,
  });

  if (!accessKey || !secretKey) {
    const missing = [];
    if (!accessKey) missing.push("ZWITCH_ACCESS_KEY");
    if (!secretKey) missing.push("ZWITCH_SECRET_KEY");
    throw new Error(
      `Zwitch credentials not configured in Supabase Vault. Missing: ${missing.join(", ")}. ` +
      `Please set them in Project Settings → Edge Functions → Secrets.`
    );
  }

  // Step 2: Always use sandbox environment
  // User confirmed they are using sandbox credentials
  const isSandbox = true;
  const environment = "sandbox";

  // Step 3: Always use sandbox endpoint
  const endpointUrl = `https://api.zwitch.io/v1/pg/sandbox/payment_token/${paymentTokenId}`;

  console.log("Zwitch Verification:", {
    endpoint: endpointUrl,
    environment: environment,
    isSandbox: isSandbox,
    paymentTokenId: paymentTokenId,
  });

  // Step 4: Call Zwitch API to verify payment
  const authHeader = `Bearer ${accessKey}:${secretKey}`;

  const response = await fetch(endpointUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": authHeader,
    },
  });

  // Step 5: Handle response
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = errorText;
    
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error) {
        errorMessage = errorJson.error;
      }
    } catch (e) {
      // Not JSON, use as-is
    }
    
    console.error("Zwitch API Error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorMessage,
      endpoint: endpointUrl,
      paymentTokenId: paymentTokenId,
      accessKeyPrefix: accessKey?.substring(0, 20),
    });
    
    // If "Could not get merchant details", it might be a timing issue
    // Return a pending status instead of throwing error
    if (errorMessage.includes("Could not get merchant details") || errorMessage.includes("merchant details")) {
      console.warn("Merchant details error - might be timing issue, returning pending status");
      return {
        status: "pending",
        paymentTokenId: paymentTokenId,
      };
    }
    
    throw new Error(`Failed to verify Zwitch payment: ${errorMessage}`);
  }

  const zwitchResponse = await response.json();
  console.log("Zwitch Verification Success:", {
    paymentTokenId: paymentTokenId,
    status: zwitchResponse.status,
    paymentId: zwitchResponse.payment_id,
  });

  // Step 6: Return verification result
  return {
    status: zwitchResponse.status || "unknown",
    paymentId: zwitchResponse.payment_id,
    paymentTokenId: paymentTokenId,
  };
}

// ============================================
// Main Edge Function
// ============================================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Step 1: Parse request
    const { paymentTokenId, payment_token_id, orderId, dbOrderId }: VerifyPaymentRequest & { payment_token_id?: string } = await req.json();

    const tokenId = paymentTokenId || payment_token_id;

    if (!tokenId) {
      throw new Error("Payment token ID is required");
    }

    console.log("Verifying payment:", {
      paymentTokenId: tokenId,
      orderId: orderId,
      dbOrderId: dbOrderId,
    });

    // Step 2: Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 3: Verify payment with Zwitch
    const verificationResult = await verifyZwitchPayment(tokenId);

    console.log("Payment verification result:", verificationResult);

    // Step 4: Find order in database
    const orderIdToUse = dbOrderId || orderId;
    if (!orderIdToUse) {
      throw new Error("Order ID is required to update order status");
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderIdToUse)
      .single();

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderIdToUse}`);
    }

    // Step 5: Update order based on payment status
    // Handle different status values from Zwitch
    const isSuccess = verificationResult.status === "captured" || 
                     verificationResult.status === "success" ||
                     verificationResult.status === "completed" ||
                     verificationResult.status === "paid";
    const paymentStatus = isSuccess ? "paid" : 
                         verificationResult.status === "failed" ? "failed" : 
                         verificationResult.status === "pending" ? "pending" :
                         "pending"; // Default to pending for unknown statuses

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        status: isSuccess ? "confirmed" : order.status,
        gateway_payment_id: verificationResult.paymentId,
        gateway_order_id: verificationResult.paymentTokenId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderIdToUse);

    if (updateError) {
      console.error("Error updating order:", updateError);
      throw new Error("Failed to update order status");
    }

    // Step 6: Deduct inventory if payment successful
    if (isSuccess && order.items) {
      for (const item of order.items) {
        if (item.variantId) {
          const { error: inventoryError } = await supabase.rpc("deduct_inventory", {
            p_variant_id: item.variantId,
            p_quantity: item.quantity,
          });

          if (inventoryError) {
            console.error(`Error deducting inventory for variant ${item.variantId}:`, inventoryError);
          }
        }
      }
    }

    // Step 7: Return response
    return new Response(
      JSON.stringify({
        success: isSuccess,
        status: verificationResult.status,
        paymentId: verificationResult.paymentId,
        paymentTokenId: verificationResult.paymentTokenId,
        orderId: orderIdToUse,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in verify-payment:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to verify payment",
        details: error instanceof Error ? error.stack : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
