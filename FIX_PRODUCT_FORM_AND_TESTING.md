# Fix Product Form & Testing Setup

## Issue 1: Product Form Blank Page

The product form should work now. If it's still blank, check:

1. **Browser Console** - Open DevTools (F12) and check for errors
2. **Network Tab** - Check if any API calls are failing
3. **React DevTools** - Check if the component is rendering

### Common Issues:
- Missing dependencies: Run `npm install`
- TypeScript errors: Check terminal for compilation errors
- Missing environment variables: Ensure Supabase is configured

## Issue 2: Make Everything Active for Testing

I've created a migration file that will activate everything:

**File:** `supabase/migrations/20250113000014_make_everything_active_for_testing.sql`

### To Apply:
1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of the migration file
3. Paste and run it

This will:
- ✅ Make all products active
- ✅ Create test coupons (TEST10, TEST50)
- ✅ Activate all banners
- ✅ Activate all category showcase items
- ✅ Activate all luxury mood categories
- ✅ Activate all gift guide items
- ✅ Activate all influencer showcase items
- ✅ Activate all store locations

### Alternative: Manual SQL

Run this in Supabase SQL Editor:

```sql
-- Make all products active
UPDATE products SET status = 'active' WHERE status = 'draft';

-- Create test coupons
INSERT INTO coupons (code, name, description, discount_type, discount_value, valid_from, valid_until, is_active, is_paused, applicable_to, max_uses, max_uses_per_user, minimum_order_amount)
VALUES 
  ('TEST10', 'Test Coupon 10%', '10% off for testing', 'percentage', 10, NOW() - INTERVAL '1 day', NOW() + INTERVAL '1 year', true, false, 'all', NULL, 10, 100),
  ('TEST50', 'Test Coupon ₹50', '₹50 off for testing', 'fixed_amount', 50, NOW() - INTERVAL '1 day', NOW() + INTERVAL '1 year', true, false, 'all', NULL, 10, 200)
ON CONFLICT (code) DO UPDATE SET is_active = true, is_paused = false;

-- Activate all media items
UPDATE banners SET is_active = true;
UPDATE category_showcase_items SET is_active = true;
UPDATE luxury_mood_categories SET is_active = true;
UPDATE gift_guide_items SET is_active = true;
UPDATE influencer_showcase_items SET is_active = true;
UPDATE store_locations SET is_active = true;
```

## Issue 3: Payment Gateway Integration

The payment gateway (Zwitch) is **already integrated** in the code! You just need to configure the secrets.

### Step 1: Get Zwitch Credentials

You need:
- **ZWITCH_ACCESS_KEY**: `ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa` (from PRD.md)
- **ZWITCH_SECRET_KEY**: Get this from your Zwitch account dashboard

### Step 2: Add Secrets to Supabase

1. Go to **Supabase Dashboard**
2. Click **Edge Functions** in left sidebar
3. Click **Secrets** (under "MANAGE")
4. Add two secrets:

   **Secret 1:**
   - Name: `ZWITCH_ACCESS_KEY`
   - Value: `ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa`
   - Click "Add secret"

   **Secret 2:**
   - Name: `ZWITCH_SECRET_KEY`
   - Value: Your Zwitch Secret Key (from Zwitch dashboard)
   - Click "Add secret"

### Step 3: Verify Edge Functions

Make sure these Edge Functions exist and are deployed:
- ✅ `create-razorpay-order` - Creates payment tokens
- ✅ `verify-razorpay-payment` - Verifies payments

### How Payment Works:

1. User fills checkout form
2. Frontend calls `create-razorpay-order` Edge Function
3. Function creates Zwitch payment token using your credentials
4. Zwitch Layer.js SDK opens payment UI (modal/overlay)
5. User completes payment
6. `verify-razorpay-payment` Edge Function verifies payment
7. Order is confirmed and inventory is deducted

### Testing Payment:

1. Add items to cart
2. Go to checkout
3. Fill in shipping details
4. Click "Place Order"
5. Zwitch payment modal should open
6. Use test credentials or real payment method

## Product Form Changes Made:

1. ✅ Added more product types (Pendant, Chain)
2. ✅ Changed default status from "draft" to "active" for new products (for testing)
3. ✅ Form should now render properly

## Quick Test Checklist:

- [ ] Product form loads at `/admin/products/new`
- [ ] Can create a product with status "active"
- [ ] Can add variants (size, price, inventory)
- [ ] Can upload product images
- [ ] Test coupons are created (TEST10, TEST50)
- [ ] All media items are active
- [ ] Payment gateway secrets are configured
- [ ] Can complete a test order with payment

## Troubleshooting:

### Product Form Still Blank:
1. Check browser console for errors
2. Verify all imports are correct
3. Check if AdminRoute/AdminLayout are working
4. Try refreshing the page

### Payment Not Working:
1. Verify secrets are added in Supabase
2. Check Edge Function logs for errors
3. Verify Zwitch credentials are correct
4. Check browser console for payment errors

### Items Not Showing:
1. Run the activation SQL
2. Check `is_active` status in database
3. Verify products have `status = 'active'`

