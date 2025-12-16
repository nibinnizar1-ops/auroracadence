/**
 * Base Payment Gateway Adapter Interface
 * All payment gateway implementations must implement this interface
 */

export interface PaymentGatewayConfig {
  credentials: Record<string, string>;
  isTestMode: boolean;
  webhookSecret?: string;
  config?: Record<string, any>;
}

export interface CreatePaymentOrderRequest {
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
  orderId: string; // Database order ID
  orderNumber: string; // Order number for reference
  items: Array<{
    id: string;
    title: string;
    variantId?: string;
    price: number;
    quantity: number;
  }>;
}

export interface CreatePaymentOrderResponse {
  paymentToken?: string; // For SDK-based gateways (Zwitch, Razorpay)
  orderId?: string; // Gateway order ID
  paymentId?: string; // Gateway payment ID (if available)
  redirectUrl?: string; // For redirect-based gateways (PayU, Cashfree)
  accessKey?: string; // For SDK-based gateways
  [key: string]: any; // Gateway-specific additional fields
}

export interface VerifyPaymentRequest {
  paymentTokenId?: string;
  paymentId: string;
  orderId: string; // Gateway order ID
  dbOrderId: string; // Database order ID
  amount?: number;
  currency?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  status: 'captured' | 'failed' | 'pending' | 'refunded';
  paymentId: string;
  orderId: string;
  amount?: number;
  currency?: string;
  error?: string;
}

export interface PaymentGatewayAdapter {
  /**
   * Get the gateway code (e.g., 'razorpay', 'payu', 'cashfree', 'zwitch')
   */
  getCode(): string;

  /**
   * Get the gateway display name
   */
  getName(): string;

  /**
   * Create a payment order/token
   */
  createPaymentOrder(
    request: CreatePaymentOrderRequest,
    config: PaymentGatewayConfig
  ): Promise<CreatePaymentOrderResponse>;

  /**
   * Verify a payment
   */
  verifyPayment(
    request: VerifyPaymentRequest,
    config: PaymentGatewayConfig
  ): Promise<VerifyPaymentResponse>;

  /**
   * Get the SDK script URL (for frontend loading)
   */
  getSDKUrl(): string | null;

  /**
   * Get required credential fields for this gateway
   */
  getRequiredCredentials(): string[];
}

