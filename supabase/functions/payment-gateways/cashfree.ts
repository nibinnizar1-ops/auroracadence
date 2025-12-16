/**
 * Cashfree Payment Gateway Adapter
 */

import {
  PaymentGatewayAdapter,
  PaymentGatewayConfig,
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "./base.ts";

export class CashfreeAdapter implements PaymentGatewayAdapter {
  getCode(): string {
    return "cashfree";
  }

  getName(): string {
    return "Cashfree";
  }

  getRequiredCredentials(): string[] {
    return ["app_id", "secret_key"];
  }

  getSDKUrl(): string | null {
    return "https://sdk.cashfree.com/js/v3/cashfree.js";
  }

  async createPaymentOrder(
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

    // Create Cashfree order
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

  async verifyPayment(
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

    // Verify payment from Cashfree API
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

    // Check if payment exists and is successful
    const successfulPayment = paymentData.find(
      (p: any) => p.payment_status === "SUCCESS" || p.payment_status === "SUCCESS"
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
}

