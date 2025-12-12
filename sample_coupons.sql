-- Sample Coupon Codes for Testing
-- Run these queries in Supabase SQL Editor to create test coupons

-- Example 1: Percentage Discount Coupon (20% off)
INSERT INTO public.coupons (
  code,
  name,
  description,
  discount_type,
  discount_value,
  valid_from,
  valid_until,
  max_uses,
  max_uses_per_user,
  minimum_order_amount,
  is_active,
  is_paused,
  applicable_to
) VALUES (
  'WELCOME20',
  'Welcome 20% Off',
  'Get 20% off on your first order',
  'percentage',
  20.00,
  NOW(),
  NOW() + INTERVAL '1 year', -- Valid for 1 year
  100, -- Maximum 100 uses
  1, -- 1 use per user
  500.00, -- Minimum order ₹500
  true, -- Active
  false, -- Not paused
  'all' -- Applicable to all products
);

-- Example 2: Fixed Amount Discount (₹100 off)
INSERT INTO public.coupons (
  code,
  name,
  description,
  discount_type,
  discount_value,
  valid_from,
  valid_until,
  max_uses,
  max_uses_per_user,
  minimum_order_amount,
  is_active,
  is_paused,
  applicable_to
) VALUES (
  'FLAT100',
  'Flat ₹100 Off',
  'Get ₹100 off on orders above ₹1000',
  'fixed_amount',
  100.00,
  NOW(),
  NOW() + INTERVAL '6 months', -- Valid for 6 months
  50, -- Maximum 50 uses
  1, -- 1 use per user
  1000.00, -- Minimum order ₹1000
  true, -- Active
  false, -- Not paused
  'all' -- Applicable to all products
);

-- Example 3: Unlimited Use Coupon (10% off, no limits)
INSERT INTO public.coupons (
  code,
  name,
  description,
  discount_type,
  discount_value,
  valid_from,
  valid_until,
  max_uses, -- NULL = unlimited
  max_uses_per_user,
  minimum_order_amount, -- NULL = no minimum
  is_active,
  is_paused,
  applicable_to
) VALUES (
  'SUMMER10',
  'Summer Sale 10%',
  '10% off on all products - Summer Sale',
  'percentage',
  10.00,
  NOW(),
  NOW() + INTERVAL '3 months', -- Valid for 3 months
  NULL, -- Unlimited uses
  5, -- 5 uses per user
  NULL, -- No minimum order amount
  true, -- Active
  false, -- Not paused
  'all' -- Applicable to all products
);

-- Example 4: High Value Coupon (30% off, for big orders)
INSERT INTO public.coupons (
  code,
  name,
  description,
  discount_type,
  discount_value,
  valid_from,
  valid_until,
  max_uses,
  max_uses_per_user,
  minimum_order_amount,
  is_active,
  is_paused,
  applicable_to
) VALUES (
  'PREMIUM30',
  'Premium 30% Off',
  '30% off on orders above ₹5000',
  'percentage',
  30.00,
  NOW(),
  NOW() + INTERVAL '2 months',
  20, -- Limited to 20 uses
  1, -- 1 use per user
  5000.00, -- Minimum order ₹5000
  true, -- Active
  false, -- Not paused
  'all' -- Applicable to all products
);

-- Example 5: Small Discount for Testing (₹50 off, low minimum)
INSERT INTO public.coupons (
  code,
  name,
  description,
  discount_type,
  discount_value,
  valid_from,
  valid_until,
  max_uses,
  max_uses_per_user,
  minimum_order_amount,
  is_active,
  is_paused,
  applicable_to
) VALUES (
  'TEST50',
  'Test Coupon ₹50',
  'Test coupon - ₹50 off (for testing)',
  'fixed_amount',
  50.00,
  NOW(),
  NOW() + INTERVAL '1 year',
  NULL, -- Unlimited for testing
  10, -- 10 uses per user for testing
  100.00, -- Minimum order ₹100 (easy to test)
  true, -- Active
  false, -- Not paused
  'all' -- Applicable to all products
);

-- View all created coupons
SELECT 
  code,
  name,
  discount_type,
  discount_value,
  CASE 
    WHEN discount_type = 'percentage' THEN discount_value || '%'
    ELSE '₹' || discount_value
  END as discount_display,
  minimum_order_amount,
  valid_from,
  valid_until,
  is_active,
  is_paused,
  max_uses,
  max_uses_per_user
FROM public.coupons
ORDER BY created_at DESC;

