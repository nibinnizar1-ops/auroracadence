/**
 * Payment Gateway Factory
 * Gets the active gateway adapter from database
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import type { PaymentGatewayAdapter, PaymentGatewayConfig } from "./base.ts";
import { ZwitchAdapter } from "./zwitch.ts";
import { RazorpayAdapter } from "./razorpay.ts";
import { PayUAdapter } from "./payu.ts";
import { CashfreeAdapter } from "./cashfree.ts";

export async function getActiveGateway(
  supabaseUrl: string,
  supabaseServiceKey: string
): Promise<{
  adapter: PaymentGatewayAdapter;
  config: PaymentGatewayConfig;
  gatewayId: string;
} | null> {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get active gateway from database
  const { data: gateway, error } = await supabase
    .from("payment_gateways")
    .select("*")
    .eq("is_active", true)
    .single();

  if (error || !gateway) {
    console.error("Error fetching active gateway:", error);
    return null;
  }

  // Get adapter based on gateway code
  let adapter: PaymentGatewayAdapter;
  switch (gateway.code) {
    case "zwitch":
      adapter = new ZwitchAdapter();
      break;
    case "razorpay":
      adapter = new RazorpayAdapter();
      break;
    case "payu":
      adapter = new PayUAdapter();
      break;
    case "cashfree":
      adapter = new CashfreeAdapter();
      break;
    default:
      throw new Error(`Unsupported payment gateway: ${gateway.code}`);
  }

  // Build config from database
  const config: PaymentGatewayConfig = {
    credentials: gateway.credentials as Record<string, string>,
    isTestMode: gateway.is_test_mode,
    webhookSecret: gateway.webhook_secret || undefined,
    config: gateway.config as Record<string, any> || {},
  };

  return {
    adapter,
    config,
    gatewayId: gateway.id,
  };
}

export function getGatewayAdapter(code: string): PaymentGatewayAdapter {
  switch (code) {
    case "zwitch":
      return new ZwitchAdapter();
    case "razorpay":
      return new RazorpayAdapter();
    case "payu":
      return new PayUAdapter();
    case "cashfree":
      return new CashfreeAdapter();
    default:
      throw new Error(`Unsupported payment gateway: ${code}`);
  }
}

