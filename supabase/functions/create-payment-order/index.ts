import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================
// Gateway Adapters (Inlined for standalone deployment)
// ============================================

interface PaymentGatewayConfig {
  credentials: Record<string, string>;
  isTestMode: boolean;
  webhookSecret?: string;
  config?: Record<string, any>;
}

interface CreatePaymentOrderRequest {
  amount: number;
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
  orderId: string;
  orderNumber: string;
  items: Array<{
    id: string;
    title: string;
    variantId?: string;
    price: number;
    quantity: number;
  }>;
}

interface CreatePaymentOrderResponse {
  paymentToken?: string;
  orderId?: string;
  paymentId?: string;
  redirectUrl?: string;
  accessKey?: string;
  [key: string]: any;
}

// Zwitch Adapter
async function createZwitchPaymentOrder(
  request: CreatePaymentOrderRequest,
  config: PaymentGatewayConfig
): Promise<CreatePaymentOrderResponse> {
  const accessKey = config.credentials.access_key;
  const secretKey = config.credentials.secret_key;

  if (!accessKey || !secretKey) {
    throw new Error("Zwitch credentials not configured");
  }

  const apiBaseUrl = config.config?.api_base_url || "https://api.zwitch.io/v1/";
  const mtx = `MTX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const tokenResponse = await fetch(`${apiBaseUrl}payment_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${secretKey}`,
    },
    body: JSON.stringify({
      amount: Math.round(request.amount * 100), // Convert to paise for Zwitch API
      currency: request.currency || "INR",
      contact_number: request.customerInfo.phone,
      email_id: request.customerInfo.email,
      mtx: mtx,
      udf: {
        customer_name: request.customerInfo.name,
        address: request.customerInfo.address,
        city: request.customerInfo.city,
        state: request.customerInfo.state,
        pincode: request.customerInfo.pincode,
        order_id: request.orderId,
        order_number: request.orderNumber,
      },
    }),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("Zwitch payment token creation failed:", {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      error: errorText,
      requestUrl: `${apiBaseUrl}payment_token`,
      requestBody: {
        amount: request.amount,
        currency: request.currency,
        contact_number: request.customerInfo.phone,
        email_id: request.customerInfo.email,
      }
    });
    throw new Error(`Failed to create Zwitch payment token: ${errorText}`);
  }

  const zwitchPayment = await tokenResponse.json();

  return {
    paymentToken: zwitchPayment.id,
    orderId: zwitchPayment.id,
    accessKey: accessKey,
  };
}

// Razorpay Adapter
async function createRazorpayPaymentOrder(
  request: CreatePaymentOrderRequest,
  config: PaymentGatewayConfig
): Promise<CreatePaymentOrderResponse> {
  const keyId = config.credentials.key_id;
  const keySecret = config.credentials.key_secret;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials not configured");
  }

  const apiBaseUrl = "https://api.razorpay.com/v1/";

  const orderResponse = await fetch(`${apiBaseUrl}orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${btoa(`${keyId}:${keySecret}`)}`,
    },
    body: JSON.stringify({
      amount: Math.round(request.amount * 100),
      currency: request.currency || "INR",
      receipt: request.orderNumber,
      notes: {
        order_id: request.orderId,
        customer_name: request.customerInfo.name,
        customer_email: request.customerInfo.email,
        customer_phone: request.customerInfo.phone,
      },
    }),
  });

  if (!orderResponse.ok) {
    const error = await orderResponse.text();
    console.error("Razorpay order creation failed:", error);
    throw new Error("Failed to create Razorpay order");
  }

  const razorpayOrder = await orderResponse.json();

  return {
    orderId: razorpayOrder.id,
    paymentToken: razorpayOrder.id,
    accessKey: keyId,
  };
}

// PayU Adapter
async function createPayUPaymentOrder(
  request: CreatePaymentOrderRequest,
  config: PaymentGatewayConfig
): Promise<CreatePaymentOrderResponse> {
  const merchantKey = config.credentials.merchant_key;
  const merchantSalt = config.credentials.merchant_salt;
  const merchantId = config.credentials.merchant_id;

  if (!merchantKey || !merchantSalt || !merchantId) {
    throw new Error("PayU credentials not configured");
  }

  const txnId = `TXN${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const amount = request.amount.toString();
  const productInfo = request.items.map((i) => i.title).join(", ");
  const firstName = request.customerInfo.name.split(" ")[0];
  const email = request.customerInfo.email;
  const phone = request.customerInfo.phone;

  // Generate hash for PayU
  const hashString = `${merchantKey}|${txnId}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${merchantSalt}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(hashString);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  const apiBaseUrl = config.isTestMode
    ? "https://test.payu.in/_payment"
    : "https://secure.payu.in/_payment";

  return {
    orderId: txnId,
    redirectUrl: apiBaseUrl,
    hash: hash,
    merchantKey: merchantKey,
    merchantId: merchantId,
    txnId: txnId,
    amount: amount,
    productInfo: productInfo,
    firstName: firstName,
    email: email,
    phone: phone,
    customerInfo: request.customerInfo,
  };
}

// Cashfree Adapter
async function createCashfreePaymentOrder(
  request: CreatePaymentOrderRequest,
  config: PaymentGatewayConfig
): Promise<CreatePaymentOrderResponse> {
  const appId = config.credentials.app_id;
  const secretKey = config.credentials.secret_key;

  if (!appId || !secretKey) {
    throw new Error("Cashfree credentials not configured");
  }

  const apiBaseUrl = config.isTestMode
    ? "https://sandbox.cashfree.com/pg"
    : "https://api.cashfree.com/pg";

  const orderResponse = await fetch(`${apiBaseUrl}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "x-api-version": "2023-08-01",
    },
    body: JSON.stringify({
      order_id: request.orderNumber,
      order_amount: request.amount,
      order_currency: request.currency || "INR",
      customer_details: {
        customer_id: request.customerInfo.email,
        customer_name: request.customerInfo.name,
        customer_email: request.customerInfo.email,
        customer_phone: request.customerInfo.phone,
      },
      order_meta: {
        return_url: `${config.config?.return_url || ""}?order_id={order_id}`,
        notify_url: config.config?.webhook_url || "",
      },
    }),
  });

  if (!orderResponse.ok) {
    const error = await orderResponse.text();
    console.error("Cashfree order creation failed:", error);
    throw new Error("Failed to create Cashfree order");
  }

  const cashfreeOrder = await orderResponse.json();

  return {
    orderId: cashfreeOrder.order_id,
    paymentToken: cashfreeOrder.payment_session_id,
    accessKey: appId,
  };
}

// Get active gateway and create payment order
async function getActiveGatewayAndCreateOrder(
  supabaseUrl: string,
  supabaseServiceKey: string,
  request: CreatePaymentOrderRequest
): Promise<CreatePaymentOrderResponse & { gatewayCode: string; gatewayName: string }> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data: gateway, error } = await supabase
    .from("payment_gateways")
    .select("*")
    .eq("is_active", true)
    .single();

  if (error || !gateway) {
    console.error("Error fetching active gateway:", error);
    throw new Error(`No active payment gateway configured. Error: ${error?.message || "Unknown error"}`);
  }

  console.log("Active gateway found:", { code: gateway.code, name: gateway.name, hasCredentials: !!gateway.credentials });

  // Check if credentials exist
  if (!gateway.credentials || Object.keys(gateway.credentials).length === 0) {
    throw new Error(`Payment gateway "${gateway.name}" is not configured. Please add credentials in admin panel.`);
  }

  const config: PaymentGatewayConfig = {
    credentials: gateway.credentials as Record<string, string>,
    isTestMode: gateway.is_test_mode,
    webhookSecret: gateway.webhook_secret || undefined,
    config: gateway.config as Record<string, any> || {},
  };

  let paymentResponse: CreatePaymentOrderResponse;
  switch (gateway.code) {
    case "zwitch":
      paymentResponse = await createZwitchPaymentOrder(request, config);
      break;
    case "razorpay":
      paymentResponse = await createRazorpayPaymentOrder(request, config);
      break;
    case "payu":
      paymentResponse = await createPayUPaymentOrder(request, config);
      break;
    case "cashfree":
      paymentResponse = await createCashfreePaymentOrder(request, config);
      break;
    default:
      throw new Error(`Unsupported payment gateway: ${gateway.code}`);
  }

  return {
    ...paymentResponse,
    gatewayCode: gateway.code,
    gatewayName: gateway.name,
  };
}

// ============================================
// Main Edge Function
// ============================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency, customerInfo, items, userId, couponCode } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate coupon if provided
    let couponId: string | null = null;
    let discountAmount = 0;
    let orderSubtotal = amount / 100;
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
          }
        }
      } catch (error) {
        console.error("Error validating coupon:", error);
      }
    }

    const mtx = `MTX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Validate inventory
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

    // Create order in database
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

    // Get gateway and update order with gateway_id (if column exists)
    try {
      const { data: activeGateway } = await supabase
        .from("payment_gateways")
        .select("id")
        .eq("is_active", true)
        .single();

      if (activeGateway) {
        // Try to update, but don't fail if column doesn't exist
        await supabase
          .from("orders")
          .update({ payment_gateway_id: activeGateway.id })
          .eq("id", dbOrder.id);
      }
    } catch (gatewayUpdateError) {
      // Ignore if column doesn't exist (migration not applied yet)
      console.warn("Could not update payment_gateway_id (column may not exist):", gatewayUpdateError);
    }

    // Create order line items
    const orderLineItems = items.map((item: any) => ({
      order_id: dbOrder.id,
      product_id: item.id || null,
      variant_id: item.variantId || null,
      quantity: item.quantity,
      price: parseFloat(item.price) || 0,
      title: item.title || "Product",
      variant_title: item.variantTitle || null,
    }));

    await supabase.from("order_line_items").insert(orderLineItems);

    // Record coupon usage
    if (couponId && discountAmount > 0) {
      await supabase.from("coupon_usage").insert({
        coupon_id: couponId,
        order_id: dbOrder.id,
        user_id: userId || null,
        discount_amount: discountAmount,
        order_total_before_discount: orderSubtotal,
        order_total_after_discount: orderTotal,
      });
    }

    // Create payment order using gateway
    let paymentResponse;
    try {
      paymentResponse = await getActiveGatewayAndCreateOrder(
        supabaseUrl,
        supabaseServiceKey,
        {
          amount: orderTotal,
          currency: currency || "INR",
          customerInfo,
          orderId: dbOrder.id,
          orderNumber: mtx,
          items: items.map((item: any) => ({
            id: item.id,
            title: item.title,
            variantId: item.variantId,
            price: parseFloat(item.price) || 0,
            quantity: item.quantity,
          })),
        }
      );
    } catch (gatewayError) {
      console.error("Error creating payment order with gateway:", gatewayError);
      // Delete the order if payment gateway fails
      await supabase.from("orders").delete().eq("id", dbOrder.id);
      throw new Error(`Failed to create payment order: ${gatewayError instanceof Error ? gatewayError.message : "Unknown error"}`);
    }

    // Update order with gateway order ID
    await supabase
      .from("orders")
      .update({
        gateway_order_id: paymentResponse.orderId,
        razorpay_order_id: paymentResponse.orderId,
        payment_method: paymentResponse.gatewayCode,
      })
      .eq("id", dbOrder.id);

    console.log(`${paymentResponse.gatewayName} payment order created:`, paymentResponse.orderId);

    return new Response(
      JSON.stringify({
        paymentToken: paymentResponse.paymentToken || paymentResponse.orderId,
        accessKey: paymentResponse.accessKey,
        amount: orderTotal,
        currency: currency || "INR",
        mtx: mtx,
        dbOrderId: dbOrder.id,
        gatewayCode: paymentResponse.gatewayCode,
        redirectUrl: paymentResponse.redirectUrl,
        ...paymentResponse,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in create-payment-order:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error stack:", errorStack);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorStack ? errorStack.split('\n').slice(0, 5).join('\n') : undefined
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
