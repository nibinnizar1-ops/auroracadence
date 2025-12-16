# Testing Setup Guide

## Issues Fixed

### 1. Product Form Blank Page
The product form should now work. If it's still blank, check:
- Browser console for errors
- Network tab for failed requests
- Ensure all dependencies are installed

### 2. Making Everything Active for Testing

#### Products
- When creating products, set status to "active" instead of "draft"
- Or update existing products to active status

#### Coupons
- Create test coupons with `is_active: true` and `is_paused: false`
- Set valid dates to cover current date

#### Orders
- Orders are automatically created when payment is successful
- For testing without payment, you can manually create orders in the database

### 3. Payment Gateway (Zwitch)

The payment gateway is already integrated! You just need to configure the secrets:

#### Required Secrets in Supabase:
1. Go to Supabase Dashboard → Edge Functions → Secrets
2. Add these two secrets:

**ZWITCH_ACCESS_KEY**
- Value: `ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa` (from PRD.md)

**ZWITCH_SECRET_KEY**
- Value: Your Zwitch Secret Key (get from your Zwitch account)

#### How Payment Works:
1. User fills checkout form
2. Frontend calls `create-razorpay-order` Edge Function
3. Function creates Zwitch payment token
4. Zwitch Layer.js SDK opens payment UI
5. After payment, `verify-razorpay-payment` Edge Function verifies and completes order

#### Testing Payment:
- Use Zwitch test mode credentials if available
- Or use real credentials in test mode
- Payment will open in a modal/overlay

## Quick Test Setup SQL

Run this in Supabase SQL Editor to make everything active:

```sql
-- Make all products active
UPDATE products SET status = 'active' WHERE status = 'draft';

-- Create a test coupon
INSERT INTO coupons (
  code, name, description,
  discount_type, discount_value,
  valid_from, valid_until,
  is_active, is_paused,
  applicable_to
) VALUES (
  'TEST10', 'Test Coupon', '10% off for testing',
  'percentage', 10,
  NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days',
  true, false,
  'all'
) ON CONFLICT (code) DO NOTHING;

-- Make all banners active
UPDATE banners SET is_active = true;

-- Make all category showcase items active
UPDATE category_showcase_items SET is_active = true;

-- Make all luxury mood categories active
UPDATE luxury_mood_categories SET is_active = true;

-- Make all gift guide items active
UPDATE gift_guide_items SET is_active = true;

-- Make all influencer showcase items active
UPDATE influencer_showcase_items SET is_active = true;

-- Make all store locations active
UPDATE store_locations SET is_active = true;
```

