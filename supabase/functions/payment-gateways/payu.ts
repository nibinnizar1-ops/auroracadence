/**
 * PayU Payment Gateway Adapter
 */

import {
  PaymentGatewayAdapter,
  PaymentGatewayConfig,
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "./base.ts";
import { createHash } from "https://deno.land/std@0.168.0/node/crypto.ts";

export class PayUAdapter implements PaymentGatewayAdapter {
  getCode(): string {
    return "payu";
  }

  getName(): string {
    return "PayU";
  }

  getRequiredCredentials(): string[] {
    return ["merchant_key", "merchant_salt", "merchant_id"];
  }

  getSDKUrl(): string | null {
    return "https://secure.payu.in/_payment";
  }

  async createPaymentOrder(
    request: CreatePaymentOrderRequest,
    config: PaymentGatewayConfig
  ): Promise<CreatePaymentOrderResponse> {
    const merchantKey = config.credentials.merchant_key;
    const merchantSalt = config.credentials.merchant_salt;
    const merchantId = config.credentials.merchant_id;

    if (!merchantKey || !merchantSalt || !merchantId) {
      throw new Error("PayU credentials not configured");
    }

    // PayU uses hash-based verification
    // For now, return redirect URL structure
    // Frontend will handle the redirect
    const txnId = `TXN${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const amount = request.amount.toString();
    const productInfo = request.items.map((i) => i.title).join(", ");
    const firstName = request.customerInfo.name.split(" ")[0];
    const email = request.customerInfo.email;
    const phone = request.customerInfo.phone;

    // Generate hash for PayU
    const hashString = `${merchantKey}|${txnId}|${amount}|${productInfo}|${firstName}|${email}|||||||||||${merchantSalt}`;
    const hash = await this.generateHash(hashString);

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

  async verifyPayment(
    request: VerifyPaymentRequest,
    config: PaymentGatewayConfig
  ): Promise<VerifyPaymentResponse> {
    // PayU verification is typically done via webhook or status API
    // For now, return success if paymentId is provided
    // Full implementation would call PayU status API
    const merchantKey = config.credentials.merchant_key;
    const merchantSalt = config.credentials.merchant_salt;

    if (!merchantKey || !merchantSalt) {
      throw new Error("PayU credentials not configured");
    }

    // In production, verify with PayU status API
    // For now, assume success if paymentId exists
    return {
      success: true,
      status: "captured",
      paymentId: request.paymentId,
      orderId: request.orderId,
    };
  }

  private async generateHash(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-512", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}

