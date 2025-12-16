/**
 * Gateway SDK Loader
 * Dynamically loads payment gateway SDKs based on active gateway
 */

export interface GatewaySDKInfo {
  sdkUrl: string;
  gatewayCode: string;
  gatewayName: string;
}

/**
 * Get active gateway info from database
 */
export async function getActiveGatewayInfo(): Promise<GatewaySDKInfo | null> {
  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("payment_gateways")
      .select("code, name, config")
      .eq("is_active", true)
      .single();

    if (error || !data) {
      console.error("Error fetching active gateway:", error);
      return null;
    }

    const config = data.config as any || {};
    const sdkUrl = config.sdk_url || getDefaultSDKUrl(data.code);

    return {
      sdkUrl,
      gatewayCode: data.code,
      gatewayName: data.name,
    };
  } catch (error) {
    console.error("Error in getActiveGatewayInfo:", error);
    return null;
  }
}

/**
 * Get default SDK URL for a gateway
 */
function getDefaultSDKUrl(gatewayCode: string): string {
  const sdkUrls: Record<string, string> = {
    zwitch: "https://payments.open.money/layer",
    razorpay: "https://checkout.razorpay.com/v1/checkout.js",
    payu: "https://secure.payu.in/_payment",
    cashfree: "https://sdk.cashfree.com/js/v3/cashfree.js",
  };
  return sdkUrls[gatewayCode] || "";
}

/**
 * Load payment gateway SDK script
 */
export function loadGatewaySDK(sdkUrl: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Check if already loaded
    if (sdkUrl.includes("layer") && window.Layer) {
      resolve(true);
      return;
    }
    if (sdkUrl.includes("razorpay") && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    if (sdkUrl.includes("cashfree") && (window as any).Cashfree) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = sdkUrl;
    script.async = true;
    script.onload = () => {
      console.log("Gateway SDK loaded:", sdkUrl);
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load gateway SDK:", sdkUrl);
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

