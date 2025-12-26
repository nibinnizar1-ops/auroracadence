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
 * For Zwitch, always use sandbox since we're using sandbox credentials
 */
function getDefaultSDKUrl(gatewayCode: string, isSandbox?: boolean): string {
  const sdkUrls: Record<string, string> = {
    zwitch: "https://sandbox-payments.open.money/layer",  // Always sandbox
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
    // For Zwitch Layer.js, check if correct SDK is loaded
    if (sdkUrl.includes("layer")) {
      // If sandbox SDK URL but live SDK is loaded, remove and reload
      if (sdkUrl.includes("sandbox") && window.Layer) {
        const existingScript = document.querySelector('script[src*="payments.open.money"]');
        if (existingScript && !existingScript.src.includes("sandbox")) {
          console.log("Removing live Layer.js SDK, loading sandbox SDK");
          existingScript.remove();
          delete (window as any).Layer;
        } else if (existingScript && existingScript.src.includes("sandbox")) {
          // Already sandbox SDK loaded
          resolve(true);
          return;
        }
      }
      // If live SDK URL but sandbox is needed, don't use cached
      if (sdkUrl.includes("sandbox") && window.Layer) {
        const existingScript = document.querySelector('script[src*="sandbox-payments.open.money"]');
        if (existingScript) {
          resolve(true);
          return;
        }
      }
    }
    
    // Check if already loaded (for non-Zwitch SDKs)
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
    script.id = sdkUrl.includes("layer") ? "zwitch-layer-sdk" : undefined;
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

