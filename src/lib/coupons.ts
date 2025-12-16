import { supabase } from "@/integrations/supabase/client";

export interface CouponValidationResult {
  valid: boolean;
  discount: number;
  finalTotal: number;
  error?: string;
  coupon?: {
    id: string;
    code: string;
    name: string;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
  };
}

/**
 * Validate a coupon code (frontend validation for UX)
 * This provides instant feedback but final validation happens server-side
 * 
 * @param code - Coupon code to validate
 * @param cartTotal - Total cart amount
 * @param userId - Optional user ID for user-specific validation
 * @returns Validation result with discount amount and final total
 */
export async function validateCoupon(
  code: string,
  cartTotal: number,
  userId?: string
): Promise<CouponValidationResult> {
  try {
    // Trim and uppercase the code
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return {
        valid: false,
        discount: 0,
        finalTotal: cartTotal,
        error: 'Please enter a coupon code',
      };
    }

    // Fetch coupon from database
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (error || !coupon) {
      return {
        valid: false,
        discount: 0,
        finalTotal: cartTotal,
        error: 'Invalid coupon code',
      };
    }

    // Check if coupon is active
    if (!coupon.is_active) {
      return {
        valid: false,
        discount: 0,
        finalTotal: cartTotal,
        error: 'This coupon is not active',
      };
    }

    // Check if coupon is paused
    if (coupon.is_paused) {
      return {
        valid: false,
        discount: 0,
        finalTotal: cartTotal,
        error: 'This coupon is currently paused',
      };
    }

    // Check date validity
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = new Date(coupon.valid_until);

    if (now < validFrom) {
      return {
        valid: false,
        discount: 0,
        finalTotal: cartTotal,
        error: 'This coupon is not yet valid',
      };
    }

    if (now > validUntil) {
      return {
        valid: false,
        discount: 0,
        finalTotal: cartTotal,
        error: 'This coupon has expired',
      };
    }

    // Check minimum order amount
    if (coupon.minimum_order_amount && cartTotal < coupon.minimum_order_amount) {
      return {
        valid: false,
        discount: 0,
        finalTotal: cartTotal,
        error: `Minimum order amount of ₹${coupon.minimum_order_amount} required`,
      };
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (cartTotal * coupon.discount_value) / 100;
    } else {
      // fixed_amount
      discount = coupon.discount_value;
    }

    // Ensure discount doesn't exceed cart total
    discount = Math.min(discount, cartTotal);

    const finalTotal = Math.max(0, cartTotal - discount);

    return {
      valid: true,
      discount: parseFloat(discount.toFixed(2)),
      finalTotal: parseFloat(finalTotal.toFixed(2)),
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
      },
    };
  } catch (error) {
    console.error('Error validating coupon:', error);
    return {
      valid: false,
      discount: 0,
      finalTotal: cartTotal,
      error: 'An error occurred while validating the coupon',
    };
  }
}

export interface AvailableCoupon {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  minimum_order_amount: number | null;
  valid_until: string;
}

/**
 * Fetch all active and available coupons
 * @returns List of available coupons
 */
export async function getAvailableCoupons(): Promise<AvailableCoupon[]> {
  try {
    const now = new Date().toISOString();

    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('id, code, name, description, discount_type, discount_value, minimum_order_amount, valid_until')
      .eq('is_active', true)
      .eq('is_paused', false)
      .gte('valid_until', now) // Not expired
      .lte('valid_from', now) // Already valid
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }

    return coupons || [];
  } catch (error) {
    console.error('Error in getAvailableCoupons:', error);
    return [];
  }
}

/**
 * Fetch coupon by ID
 * @param couponId - Coupon ID
 * @returns Coupon details or null
 */
export async function getCouponById(couponId: string): Promise<{
  id: string;
  code: string;
  name: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  valid_until: string;
} | null> {
  try {
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('id, code, name, description, discount_type, discount_value, valid_until')
      .eq('id', couponId)
      .single();

    if (error || !coupon) {
      return null;
    }

    return coupon;
  } catch (error) {
    console.error('Error fetching coupon by ID:', error);
    return null;
  }
}

