# Fix 500 Internal Server Error

The Edge Function is returning a 500 error. Here's how to diagnose and fix it:

## Step 1: Check Edge Function Logs (MOST IMPORTANT!)

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click on **`create-payment-order`**
3. Click on **"Logs"** tab
4. Try to pay again
5. **Look for the red error message** - this will tell us exactly what's wrong

**Share the exact error message from the logs!**

## Step 2: Verify Active Gateway

Run this SQL in Supabase SQL Editor:

```sql
SELECT id, name, code, is_active, 
       CASE 
         WHEN credentials = '{}'::jsonb OR credentials IS NULL THEN 'Not Configured' 
         ELSE 'Configured' 
       END as status,
       credentials
FROM public.payment_gateways 
WHERE is_active = true;
```

**Expected:** Should return 1 row with:
- `is_active = true`
- `status = 'Configured'`
- `credentials` should NOT be `{}` or `null`

**If no results:**
- No gateway is active. Go to Admin Panel → Payments → Gateways → Activate one

**If "Not Configured":**
- Gateway is active but has no credentials
- Go to Admin Panel → Payments → Gateways → Configure → Enter credentials → Save

## Step 3: Check Migration Applied

Run this SQL:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN ('payment_gateway_id', 'gateway_order_id');
```

**Expected:** Should return 2 rows

**If no results:**
- Migration not applied
- Apply: `20250114000005_update_orders_for_gateways.sql`

## Step 4: Common Errors & Fixes

### Error: "No active payment gateway configured"
**Fix:** 
1. Go to Admin Panel → Payments → Gateways
2. Configure a gateway (enter Access Key & Secret Key for Zwitch)
3. Click "Activate"

### Error: "Payment gateway is not configured"
**Fix:** 
- Gateway is active but credentials are empty
- Go to Admin Panel → Payments → Gateways → Configure → Enter credentials

### Error: "column payment_gateway_id does not exist"
**Fix:** 
- Apply migration: `20250114000005_update_orders_for_gateways.sql`

### Error: "Zwitch credentials not configured"
**Fix:** 
- Check that `access_key` and `secret_key` are in the credentials JSON
- Re-enter credentials in admin panel

## What I've Fixed

I've improved error handling in the Edge Function to:
1. Show more detailed error messages
2. Check if credentials exist before using them
3. Handle missing `payment_gateway_id` column gracefully

## Next Steps

1. **Check Edge Function logs** (Step 1) - This is the most important!
2. **Share the exact error message** from the logs
3. **Verify active gateway** (Step 2)
4. **Check migration** (Step 3)

Once you share the error from the logs, I can provide a specific fix!

