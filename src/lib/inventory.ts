import { supabase } from "@/integrations/supabase/client";

export interface InventoryCheckResult {
  available: boolean;
  quantity?: number;
  requested?: number;
  policy?: 'deny' | 'continue';
  allows_backorder?: boolean;
  error?: string;
}

/**
 * Check if a variant has sufficient inventory
 * @param variantId - Variant UUID
 * @param requestedQuantity - Quantity requested
 */
export async function checkInventory(
  variantId: string,
  requestedQuantity: number
): Promise<InventoryCheckResult> {
  try {
    const { data, error } = await supabase.rpc('check_inventory_availability', {
      p_variant_id: variantId,
      p_requested_quantity: requestedQuantity,
    });

    if (error) {
      console.error('Error checking inventory:', error);
      return {
        available: false,
        error: error.message || 'Failed to check inventory',
      };
    }

    return data as InventoryCheckResult;
  } catch (error) {
    console.error('Error in checkInventory:', error);
    return {
      available: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get inventory status for a variant
 * Returns a human-readable status
 */
export function getInventoryStatus(
  inventoryQuantity: number,
  inventoryPolicy: 'deny' | 'continue',
  threshold: number = 10
): {
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'backorder';
  label: string;
  badge: string;
} {
  if (inventoryPolicy === 'continue') {
    if (inventoryQuantity <= 0) {
      return {
        status: 'backorder',
        label: 'Available for backorder',
        badge: 'Backorder',
      };
    }
  }

  if (inventoryQuantity <= 0) {
    return {
      status: 'out_of_stock',
      label: 'Out of stock',
      badge: 'Out of Stock',
    };
  }

  if (inventoryQuantity < threshold) {
    return {
      status: 'low_stock',
      label: `Only ${inventoryQuantity} left`,
      badge: 'Low Stock',
    };
  }

  return {
    status: 'in_stock',
    label: 'In stock',
    badge: 'In Stock',
  };
}



