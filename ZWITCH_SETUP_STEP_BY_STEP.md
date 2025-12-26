# Zwitch Payment Gateway Setup - Step by Step Guide

## Prerequisites
- Zwitch LIVE credentials:
  - Access Key: `ak_live_...`
  - Secret Key: `sk_live_...`

## Step 1: Verify Database (5 minutes)

### 1.1 Check if migrations are applied

Run this SQL in Supabase SQL Editor:

```sql
-- Check if payment_gateways table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'payment_gateways'
) as table_exists;

-- Check if Zwitch gateway exists
SELECT id, name, code, is_active, is_test_mode 
FROM payment_gateways 
WHERE code = 'zwitch';

-- Check if orders table has payment_gateway_id column
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name = 'payment_gateway_id';
```

**Expected Results:**
- `table_exists = true`
- Zwitch gateway row exists (may be inactive)
- `payment_gateway_id` column exists in orders table

**If any are missing:**
- Apply migrations:
  - `20250114000003_create_payment_gateways_table.sql`
  - `20250114000005_update_orders_for_gateways.sql`
  - `20250114000006_prepopulate_gateway_types.sql`

## Step 2: Configure Zwitch Gateway in Admin Panel (5 minutes)

### 2.1 Access Admin Panel
1. Go to: `http://localhost:8080/admin/payments/gateways` (or your domain)
2. Login as admin if not already logged in

### 2.2 Configure Zwitch
1. Find "Zwitch" in the gateway list
2. Click **"Configure"** button
3. Enter your LIVE credentials:
   - **Access Key:** `ak_live_...` (your LIVE access key)
   - **Secret Key:** `sk_live_...` (your LIVE secret key)
4. **Important:** Set **"Test Mode"** toggle to **OFF** (for LIVE mode)
5. Click **"Save Configuration"**

### 2.3 Activate Zwitch
1. Go back to the gateway list
2. Find Zwitch
3. Click **"Activate"** button
4. Confirm activation (other gateways will be deactivated automatically)

### 2.4 Verify Configuration
Run this SQL to verify:

```sql
SELECT 
  code, 
  name, 
  is_active, 
  is_test_mode,
  CASE 
    WHEN credentials->>'access_key' IS NOT NULL THEN '✅ Configured' 
    ELSE '❌ Not Configured' 
  END as status,
  credentials->>'access_key' as access_key_prefix
FROM payment_gateways 
WHERE code = 'zwitch' AND is_active = true;
```

**Expected Results:**
- `is_active = true`
- `is_test_mode = false`
- `status = '✅ Configured'`
- `access_key_prefix` should start with `ak_live_`

## Step 3: Deploy Edge Functions (10 minutes)

### 3.1 Deploy `create-payment-order` Edge Function

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click on **`create-payment-order`**
3. Click **"Code"** tab (or "Edit")
4. **Copy the entire contents** of `supabase/functions/create-payment-order/index.ts`
5. **Paste** into the code editor (replace all existing code)
6. Click **"Deploy"** button
7. Wait for deployment to complete
8. Verify deployment shows "Success" or "Deployed"

### 3.2 Deploy `verify-payment` Edge Function

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click on **`verify-payment`** (or create if doesn't exist)
3. Click **"Code"** tab (or "Edit")
4. **Copy the entire contents** of `supabase/functions/verify-payment/index.ts`
5. **Paste** into the code editor (replace all existing code)
6. Click **"Deploy"** button
7. Wait for deployment to complete
8. Verify deployment shows "Success" or "Deployed"

### 3.3 Verify Edge Functions are Deployed

1. Go to **Supabase Dashboard** → **Edge Functions**
2. You should see both functions listed:
   - ✅ `create-payment-order`
   - ✅ `verify-payment`
3. Check "Last Updated" timestamp is recent

## Step 4: Test Payment Flow (10 minutes)

### 4.1 Test Payment Creation

1. **Add items to cart:**
   - Browse products on your website
   - Add at least one product to cart

2. **Go to checkout:**
   - Click cart icon
   - Click "Checkout" or "Proceed to Checkout"

3. **Fill customer details:**
   - Name
   - Email
   - Phone
   - Address
   - City
   - State
   - Pincode

4. **Initiate payment:**
   - Click **"Pay now"** button
   - **Open browser console** (F12 → Console tab) to watch for errors

5. **Expected behavior:**
   - ✅ No errors in console
   - ✅ Zwitch Layer.js SDK loads
   - ✅ Payment modal/overlay opens
   - ✅ Payment form appears

### 4.2 Check Edge Function Logs

1. Go to **Supabase Dashboard** → **Edge Functions** → **`create-payment-order`**
2. Click **"Logs"** tab
3. Look for the most recent log entry
4. **Check for:**
   - ✅ `environment: live` (should be "live", not "sandbox")
   - ✅ `endpoint: https://api.zwitch.io/v1/pg/live/payment_token`
   - ✅ No error messages
   - ✅ Payment token created successfully

**If you see errors:**
- Check the error message
- Verify credentials are correct
- Verify `is_test_mode = false` in database

### 4.3 Complete Payment

1. **In the Zwitch payment modal:**
   - Enter payment details (use test card if in test mode, or real card for live)
   - Complete the payment

2. **After payment:**
   - Payment modal should close
   - You should see success message
   - Cart should be cleared
   - You should be redirected (usually to home page)

### 4.4 Verify Payment

1. Go to **Supabase Dashboard** → **Edge Functions** → **`verify-payment`**
2. Click **"Logs"** tab
3. Check for verification logs
4. Should show payment verification successful

## Step 5: Verify Results (5 minutes)

### 5.1 Check Order in Database

Run this SQL:

```sql
SELECT 
  id,
  order_number,
  customer_name,
  customer_email,
  total,
  payment_status,
  status,
  payment_gateway_id,
  gateway_order_id,
  payment_method
FROM orders 
ORDER BY created_at DESC 
LIMIT 1;
```

**Expected:**
- Order exists with your test details
- `payment_status = 'paid'` or `'confirmed'`
- `status = 'confirmed'` or `'processing'`
- `payment_gateway_id` is not null
- `gateway_order_id` is not null
- `payment_method = 'zwitch'`

### 5.2 Check Inventory Deduction

Run this SQL:

```sql
SELECT 
  pv.id,
  pv.title,
  pv.inventory_quantity,
  oli.quantity as ordered_quantity
FROM order_line_items oli
JOIN product_variants pv ON oli.variant_id = pv.id
JOIN orders o ON oli.order_id = o.id
WHERE o.order_number = 'YOUR_ORDER_NUMBER'  -- Replace with actual order number
ORDER BY oli.created_at DESC;
```

**Expected:**
- Inventory quantity should be reduced by ordered quantity

### 5.3 Check Payment Transaction

Run this SQL:

```sql
SELECT 
  id,
  order_id,
  amount,
  currency,
  status,
  gateway,
  created_at
FROM payment_transactions 
ORDER BY created_at DESC 
LIMIT 1;
```

**Expected:**
- Payment transaction record exists
- `status = 'confirmed'` or `'paid'`
- `gateway = 'zwitch'`

## Troubleshooting

### Issue: "No active gateway configured"

**Solution:**
1. Check if gateway is activated in admin panel
2. Run: `SELECT is_active FROM payment_gateways WHERE code = 'zwitch';`
3. Should return `true`

### Issue: "Invalid access key passed in header"

**Solution:**
1. Verify credentials are correct in admin panel
2. Check `is_test_mode = false` for LIVE mode
3. Verify access key starts with `ak_live_`
4. Check Edge Function logs for endpoint used (should be `/pg/live/`)

### Issue: "Failed to load Zwitch SDK"

**Solution:**
1. Check internet connection
2. Verify SDK URL is correct: `https://payments.open.money/layer`
3. Check browser console for blocked scripts

### Issue: Payment modal doesn't open

**Solution:**
1. Check browser console for JavaScript errors
2. Verify SDK loaded: `console.log(window.Layer)` should show object
3. Check Edge Function logs for payment token creation

## Success Checklist

- [ ] Database migrations applied
- [ ] Zwitch gateway configured with LIVE credentials
- [ ] Gateway activated in admin panel
- [ ] `is_test_mode = false` in database
- [ ] Edge Functions deployed successfully
- [ ] Payment token created without errors
- [ ] Payment modal opens correctly
- [ ] Payment completes successfully
- [ ] Order created in database
- [ ] Inventory deducted correctly
- [ ] Payment status updated

## Next Steps After Setup

1. Test with real payment (small amount)
2. Monitor Edge Function logs for any issues
3. Set up webhooks (optional, for better reliability)
4. Configure email notifications for orders
5. Test refund flow (if needed)

## Support

If you encounter any issues:
1. Check Edge Function logs for exact error messages
2. Check browser console for frontend errors
3. Verify database configuration
4. Share error messages for troubleshooting

