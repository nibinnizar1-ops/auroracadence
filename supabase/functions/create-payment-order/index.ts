import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreatePaymentOrderRequest {
  amount: number; // Amount in rupees (not paise)
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  userId?: string | null;
  items: Array<{
    id: string;
    title: string;
    variantId?: string;
    price: number;
    quantity: number;
  }>;
  couponCode?: string | null;
}

// ============================================
// Zwitch Payment Token Creation
// ============================================

async function createZwitchPaymentToken(
  amount: number,
  currency: string,
  customerInfo: CreatePaymentOrderRequest["customerInfo"],
  mtx: string
): Promise<{ paymentToken: string; accessKey: string }> {
  // Step 1: Read credentials from Supabase Vault
  const accessKeyRaw = Deno.env.get("ZWITCH_ACCESS_KEY");
  const secretKeyRaw = Deno.env.get("ZWITCH_SECRET_KEY");

  // Trim whitespace and validate
  const accessKey = accessKeyRaw?.trim();
  const secretKey = secretKeyRaw?.trim();

  // Debug: List all environment variables (for troubleshooting)
  const allEnvKeys = Object.keys(Deno.env.toObject());
  const zwitchKeys = allEnvKeys.filter(k => k.includes("ZWITCH") || k.includes("zwitch"));
  
  console.log("Reading Zwitch credentials from Vault:", {
    hasAccessKey: !!accessKey,
    accessKeyPrefix: accessKey?.substring(0, 20) || "NOT FOUND",
    accessKeyLength: accessKey?.length || 0,
    accessKeyStartsWith: accessKey?.substring(0, 7) || "NONE",
    hasSecretKey: !!secretKey,
    secretKeyLength: secretKey?.length || 0,
    secretKeyStartsWith: secretKey?.substring(0, 7) || "NONE",
    allEnvKeysCount: allEnvKeys.length,
    zwitchRelatedKeys: zwitchKeys,
  });

  if (!accessKey || !secretKey) {
    const missing = [];
    if (!accessKey) missing.push("ZWITCH_ACCESS_KEY");
    if (!secretKey) missing.push("ZWITCH_SECRET_KEY");
    
    // Provide helpful debugging info
    console.error("Missing Zwitch credentials. Available environment keys:", {
      totalKeys: allEnvKeys.length,
      zwitchKeys: zwitchKeys,
      sampleKeys: allEnvKeys.slice(0, 20),
    });
    
    throw new Error(
      `Zwitch credentials not configured in Supabase Vault. Missing: ${missing.join(", ")}. ` +
      `Please set them in Project Settings → Edge Functions → Secrets, then REDEPLOY the Edge Function. ` +
      `Available env keys: ${allEnvKeys.length} total.`
    );
  }

  // Step 2: Always use sandbox environment
  // User confirmed they are using sandbox credentials
  const isSandbox = true;
  const environment = "sandbox";

  // Step 3: Always use sandbox endpoint
  const endpointUrl = "https://api.zwitch.io/v1/pg/sandbox/payment_token";

  console.log("Zwitch API Configuration:", {
    endpoint: endpointUrl,
    environment: environment,
    isSandbox: isSandbox,
    amount: amount,
    currency: currency,
    accessKeyPrefix: accessKey.substring(0, 20) + "...",
    accessKeyFull: accessKey, // Full key to verify
  });

  // Step 4: Build request body
  const requestBody: any = {
    amount: amount, // Zwitch expects amount in rupees
    currency: currency || "INR",
    contact_number: customerInfo.phone,
    email_id: customerInfo.email,
    mtx: mtx,
  };

  // Step 5: Call Zwitch API
  // Zwitch expects: Authorization: Bearer <access_key>:<secret_key>
  // Make sure there are no extra spaces or encoding issues
  const authHeader = `Bearer ${accessKey}:${secretKey}`;
  
  // Detailed logging for debugging
  console.log("=== Zwitch API Request Details ===", {
    endpoint: endpointUrl,
    method: "POST",
    authorizationHeaderFormat: `Bearer ${accessKey.substring(0, 20)}...:${secretKey.substring(0, 10)}...`,
    authorizationHeaderLength: authHeader.length,
    accessKeyFull: accessKey, // Log full key for debugging (remove in production)
    secretKeyLength: secretKey.length,
    accessKeyLength: accessKey.length,
    accessKeyStartsWith: accessKey.substring(0, 7),
    secretKeyStartsWith: secretKey.substring(0, 7),
    accessKeyEndsWith: accessKey.substring(accessKey.length - 5),
    hasSpaces: accessKey.includes(" ") || secretKey.includes(" "),
    hasNewlines: accessKey.includes("\n") || secretKey.includes("\n"),
    requestBody: requestBody,
  });

  const response = await fetch(endpointUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": authHeader,
    },
    body: JSON.stringify(requestBody),
  });

  // Step 6: Handle response
  if (!response.ok) {
    const errorText = await response.text();
    console.error("=== Zwitch API Error Response ===", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
      endpoint: endpointUrl,
      environment: environment,
      accessKeyUsed: accessKey, // Full key for debugging - verify it matches Zwitch dashboard
      accessKeyLength: accessKey.length,
      secretKeyLength: secretKey.length,
      accessKeyStartsWith: accessKey.substring(0, 10),
      secretKeyStartsWith: secretKey.substring(0, 10),
      requestBody: requestBody,
    });
    
    // Try to parse error for better message
    let errorMessage = errorText;
    try {
      const errorJson = JSON.parse(errorText);
      if (errorJson.error) {
        errorMessage = errorJson.error;
      }
      if (errorJson.request_id) {
        console.error("Zwitch Request ID:", errorJson.request_id);
      }
    } catch (e) {
      // Not JSON, use as-is
    }
    
    throw new Error(`Failed to create Zwitch payment token: ${errorMessage}`);
  }

  const zwitchResponse = await response.json();
  console.log("Zwitch API Success:", {
    paymentTokenId: zwitchResponse.id,
    response: zwitchResponse,
  });

  // Step 7: Return payment token and access key
  return {
    paymentToken: zwitchResponse.id, // This is the payment_token
    accessKey: accessKey, // Return access key for frontend Layer.js
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
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request JSON:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid request format",
          details: parseError instanceof Error ? parseError.message : String(parseError),
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const {
      amount,
      currency,
      customerInfo,
      items,
      userId,
      couponCode,
    }: CreatePaymentOrderRequest = requestBody;

    console.log("Received payment request:", {
      amount: amount,
      currency: currency,
      customerEmail: customerInfo?.email,
      itemCount: items?.length || 0,
      hasCustomerInfo: !!customerInfo,
      hasItems: !!items,
    });

    // Step 2: Validate request
    if (!amount || amount <= 0) {
      console.error("Validation error: Invalid amount", { amount });
      return new Response(
        JSON.stringify({
          error: "Invalid amount",
          details: `Amount must be greater than 0. Received: ${amount}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (!customerInfo || !customerInfo.email || !customerInfo.phone) {
      console.error("Validation error: Missing customer info", { customerInfo });
      return new Response(
        JSON.stringify({
          error: "Customer information is required",
          details: "Email and phone number are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    if (!items || items.length === 0) {
      console.error("Validation error: No items", { items });
      return new Response(
        JSON.stringify({
          error: "At least one item is required",
          details: "Cart cannot be empty",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Step 3: Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({
          error: "Server configuration error",
          details: "Supabase credentials not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Step 4: Handle coupon validation (if provided)
    let couponId: string | null = null;
    let discountAmount = 0;
    // Frontend sends amount in rupees, so use it directly
    let orderSubtotal = amount;
    let orderTotal = orderSubtotal;

    if (couponCode) {
      try {
        const validateResponse = await fetch(`${supabaseUrl}/functions/v1/validate-coupon`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseServiceKey}`,
          },
          body: JSON.stringify({
            code: couponCode,
            cartTotal: orderSubtotal,
            userId: userId || null,
            cartItems: items.map((item) => ({ product_id: item.id })),
          }),
        });

        if (validateResponse.ok) {
          const validationResult = await validateResponse.json();
          if (validationResult.valid && validationResult.coupon) {
            couponId = validationResult.coupon.id;
            discountAmount = validationResult.discount;
            orderTotal = validationResult.finalTotal;
          }
        }
      } catch (error) {
        console.error("Error validating coupon:", error);
      }
    }

    // Step 5: Generate unique transaction ID
    const mtx = `MTX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Step 6: Validate inventory (if variantId exists)
    const inventoryErrors: string[] = [];
    for (const item of items) {
      if (item.variantId) {
        const { data: inventoryCheck, error: checkError } = await supabase.rpc(
          "check_inventory_availability",
          {
            p_variant_id: item.variantId,
            p_requested_quantity: item.quantity,
          }
        );

        if (checkError || !inventoryCheck?.available) {
          inventoryErrors.push(
            `${item.title || "Item"}: ${inventoryCheck?.error || "Stock unavailable"}`
          );
        }
      }
    }

    if (inventoryErrors.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Insufficient stock",
          details: inventoryErrors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Step 7: Create order in database
    const { data: dbOrder, error: dbError } = await supabase
      .from("orders")
      .insert({
        order_number: mtx,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        user_id: userId || null,
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
        currency: currency || "INR",
        coupon_id: couponId,
        discount_amount: discountAmount,
        payment_status: "pending",
        status: "pending",
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to create order in database");
    }

    console.log("Order created in database:", {
      orderId: dbOrder.id,
      orderNumber: mtx,
    });

    // Step 8: Create Zwitch payment token
    const { paymentToken, accessKey } = await createZwitchPaymentToken(
      orderTotal, // Amount in rupees
      currency || "INR",
      customerInfo,
      mtx
    );

    // Step 9: Return response to frontend
    return new Response(
      JSON.stringify({
        paymentToken: paymentToken,
        accessKey: accessKey,
        dbOrderId: dbOrder.id,
        orderNumber: mtx,
        amount: orderTotal,
        currency: currency || "INR",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in create-payment-order:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create payment order";
    const errorStack = error instanceof Error ? error.stack : String(error);
    
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
    });
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorStack,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
