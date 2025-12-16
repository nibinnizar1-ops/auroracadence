/**
 * Zwitch Payment Gateway Adapter
 * Refactored from existing implementation
 */

import {
  PaymentGatewayAdapter,
  PaymentGatewayConfig,
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "./base.ts";

export class ZwitchAdapter implements PaymentGatewayAdapter {
  getCode(): string {
    return "zwitch";
  }

  getName(): string {
    return "Zwitch";
  }

  getRequiredCredentials(): string[] {
    return ["access_key", "secret_key"];
  }

  getSDKUrl(): string | null {
    return "https://payments.open.money/layer";
  }

  async createPaymentOrder(
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

    // Create Zwitch payment token
    const tokenResponse = await fetch(`${apiBaseUrl}payment_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        amount: request.amount, // Amount in rupees
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
      const error = await tokenResponse.text();
      console.error("Zwitch payment token creation failed:", error);
      throw new Error("Failed to create Zwitch payment token");
    }

    const zwitchPayment = await tokenResponse.json();

    return {
      paymentToken: zwitchPayment.id,
      orderId: zwitchPayment.id,
      accessKey: accessKey,
    };
  }

  async verifyPayment(
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

    // Verify payment status from Zwitch API
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
    console.log("Zwitch payment data:", paymentData);

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
}

