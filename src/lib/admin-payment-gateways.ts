import { supabase } from "@/integrations/supabase/client";

export interface PaymentGateway {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
  is_test_mode: boolean;
  credentials: Record<string, string>;
  webhook_secret?: string;
  supported_currencies: string[];
  supported_methods: string[];
  config?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Get all payment gateways
 */
export async function getAllPaymentGateways(): Promise<PaymentGateway[]> {
  try {
    const { data, error } = await supabase
      .from("payment_gateways")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payment gateways:", error);
      throw error;
    }

    return (data || []).map((gateway: any) => ({
      ...gateway,
      credentials: gateway.credentials || {},
      config: gateway.config || {},
    }));
  } catch (error) {
    console.error("Error in getAllPaymentGateways:", error);
    return [];
  }
}

/**
 * Get active payment gateway
 */
export async function getActivePaymentGateway(): Promise<PaymentGateway | null> {
  try {
    const { data, error } = await supabase
      .from("payment_gateways")
      .select("*")
      .eq("is_active", true)
      .single();

    if (error) {
      console.error("Error fetching active gateway:", error);
      return null;
    }

    return {
      ...data,
      credentials: data.credentials || {},
      config: data.config || {},
    };
  } catch (error) {
    console.error("Error in getActivePaymentGateway:", error);
    return null;
  }
}

/**
 * Get payment gateway by ID
 */
export async function getPaymentGatewayById(
  id: string
): Promise<PaymentGateway | null> {
  try {
    const { data, error } = await supabase
      .from("payment_gateways")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching payment gateway:", error);
      return null;
    }

    return {
      ...data,
      credentials: data.credentials || {},
      config: data.config || {},
    };
  } catch (error) {
    console.error("Error in getPaymentGatewayById:", error);
    return null;
  }
}

/**
 * Create payment gateway
 */
export async function createPaymentGateway(
  gatewayData: Omit<PaymentGateway, "id" | "created_at" | "updated_at">
): Promise<{ data: PaymentGateway | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("payment_gateways")
      .insert({
        name: gatewayData.name,
        code: gatewayData.code,
        is_active: gatewayData.is_active || false,
        is_test_mode: gatewayData.is_test_mode !== undefined ? gatewayData.is_test_mode : true,
        credentials: gatewayData.credentials || {},
        webhook_secret: gatewayData.webhook_secret || null,
        supported_currencies: gatewayData.supported_currencies || ["INR"],
        supported_methods: gatewayData.supported_methods || ["card", "upi", "netbanking", "wallet"],
        config: gatewayData.config || {},
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return {
      data: {
        ...data,
        credentials: data.credentials || {},
        config: data.config || {},
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Update payment gateway
 */
export async function updatePaymentGateway(
  id: string,
  updates: Partial<PaymentGateway>
): Promise<{ data: PaymentGateway | null; error: Error | null }> {
  try {
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.is_active !== undefined) updateData.is_active = updates.is_active;
    if (updates.is_test_mode !== undefined) updateData.is_test_mode = updates.is_test_mode;
    if (updates.credentials !== undefined) updateData.credentials = updates.credentials;
    if (updates.webhook_secret !== undefined) updateData.webhook_secret = updates.webhook_secret;
    if (updates.supported_currencies !== undefined) updateData.supported_currencies = updates.supported_currencies;
    if (updates.supported_methods !== undefined) updateData.supported_methods = updates.supported_methods;
    if (updates.config !== undefined) updateData.config = updates.config;

    const { data, error } = await supabase
      .from("payment_gateways")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return {
      data: {
        ...data,
        credentials: data.credentials || {},
        config: data.config || {},
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Activate payment gateway (deactivates others)
 */
export async function activatePaymentGateway(
  id: string
): Promise<{ data: PaymentGateway | null; error: Error | null }> {
  try {
    // The database trigger will automatically deactivate others
    const { data, error } = await supabase
      .from("payment_gateways")
      .update({ is_active: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return {
      data: {
        ...data,
        credentials: data.credentials || {},
        config: data.config || {},
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Delete payment gateway
 */
export async function deletePaymentGateway(
  id: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from("payment_gateways")
      .delete()
      .eq("id", id);

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Test gateway connection
 */
export async function testGatewayConnection(
  gatewayCode: string,
  credentials: Record<string, string>,
  isTestMode: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Call Edge Function to test connection
    const { data, error } = await supabase.functions.invoke("test-gateway-connection", {
      body: {
        gateway_code: gatewayCode,
        credentials,
        is_test_mode: isTestMode,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return data || { success: false, error: "Unknown error" };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to test connection",
    };
  }
}

