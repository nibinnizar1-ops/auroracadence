/**
 * Razorpay Payment Gateway Adapter
 */

import {
  PaymentGatewayAdapter,
  PaymentGatewayConfig,
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "./base.ts";

export class RazorpayAdapter implements PaymentGatewayAdapter {
  getCode(): string {
    return "razorpay";
  }

  getName(): string {
    return "Razorpay";
  }

  getRequiredCredentials(): string[] {
    return ["key_id", "key_secret"];
  }

  getSDKUrl(): string | null {
    return "https://checkout.razorpay.com/v1/checkout.js";
  }

  async createPaymentOrder(
    request: CreatePaymentOrderRequest,
    config: PaymentGatewayConfig
  ): Promise<CreatePaymentOrderResponse> {
    const keyId = config.credentials.key_id;
    const keySecret = config.credentials.key_secret;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const apiBaseUrl = config.isTestMode
      ? "https://api.razorpay.com/v1/"
      : "https://api.razorpay.com/v1/";

    // Create Razorpay order
    const orderResponse = await fetch(`${apiBaseUrl}orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${keyId}:${keySecret}`)}`,
      },
      body: JSON.stringify({
        amount: Math.round(request.amount * 100), // Convert to paise
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
      paymentToken: razorpayOrder.id, // Razorpay uses order ID as token
      accessKey: keyId, // Razorpay key ID
    };
  }

  async verifyPayment(
    request: VerifyPaymentRequest,
    config: PaymentGatewayConfig
  ): Promise<VerifyPaymentResponse> {
    const keyId = config.credentials.key_id;
    const keySecret = config.credentials.key_secret;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const apiBaseUrl = config.isTestMode
      ? "https://api.razorpay.com/v1/"
      : "https://api.razorpay.com/v1/";

    // Verify payment from Razorpay API
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
      amount: paymentData.amount ? paymentData.amount / 100 : undefined, // Convert from paise
      currency: paymentData.currency || "INR",
    };
  }
}

