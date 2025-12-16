-- Make Everything Active for Testing
-- Run this migration to activate all items for testing purposes

-- Make all products active
UPDATE products SET status = 'active' WHERE status = 'draft';

-- Create test coupons if they don't exist
INSERT INTO coupons (
  code, name, description,
  discount_type, discount_value,
  valid_from, valid_until,
  is_active, is_paused,
  applicable_to, max_uses, max_uses_per_user, minimum_order_amount
) VALUES 
  (
    'TEST10', 
    'Test Coupon 10%', 
    '10% off for testing',
    'percentage', 10,
    NOW() - INTERVAL '1 day', 
    NOW() + INTERVAL '1 year',
    true, false,
    'all', NULL, 10, 100
  ),
  (
    'TEST50', 
    'Test Coupon ₹50', 
    '₹50 off for testing',
    'fixed_amount', 50,
    NOW() - INTERVAL '1 day', 
    NOW() + INTERVAL '1 year',
    true, false,
    'all', NULL, 10, 200
  )
ON CONFLICT (code) DO UPDATE SET
  is_active = true,
  is_paused = false,
  valid_from = NOW() - INTERVAL '1 day',
  valid_until = NOW() + INTERVAL '1 year';

-- Make all banners active
UPDATE banners SET is_active = true WHERE is_active = false;

-- Make all category showcase items active
UPDATE category_showcase_items SET is_active = true WHERE is_active = false;

-- Make all luxury mood categories active
UPDATE luxury_mood_categories SET is_active = true WHERE is_active = false;

-- Make all gift guide items active
UPDATE gift_guide_items SET is_active = true WHERE is_active = false;

-- Make all influencer showcase items active
UPDATE influencer_showcase_items SET is_active = true WHERE is_active = false;

-- Make all store locations active
UPDATE store_locations SET is_active = true WHERE is_active = false;

-- Note: This migration makes everything active for testing
-- You can deactivate items later from the admin panel

