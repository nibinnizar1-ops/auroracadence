# Check Edge Function Error

## Step 1: Check Edge Function Logs

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click on **`create-payment-order`**
3. Click on **"Logs"** tab
4. Try to pay again
5. **Copy the exact error message** from the logs

The logs will show the actual error that's causing the 500 error.

## Step 2: Verify Migration Applied

Run this SQL to check if `payment_gateway_id` column exists:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN ('payment_gateway_id', 'gateway_order_id');
```

**Expected:** Should return 2 rows

**If no results:**
- Apply migration: `20250114000005_update_orders_for_gateways.sql`

## Step 3: Check Active Gateway

Run this SQL:

```sql
SELECT id, name, code, is_active, 
       CASE WHEN credentials = '{}'::jsonb THEN 'Not Configured' ELSE 'Configured' END as status,
       credentials
FROM public.payment_gateways 
WHERE is_active = true;
```

**Expected:** Should return 1 row with:
- `is_active = true`
- `status = 'Configured'`
- `credentials` should NOT be empty `{}`

**If no results or "Not Configured":**
1. Go to Admin Panel → Payments → Gateways
2. Configure a gateway (enter credentials)
3. Activate it

## Step 4: Common Errors

### Error: "column payment_gateway_id does not exist"
**Fix:** Apply migration `20250114000005_update_orders_for_gateways.sql`

### Error: "No active gateway found"
**Fix:** Activate a gateway in admin panel

### Error: "Invalid gateway credentials"
**Fix:** Re-enter credentials in admin panel

### Error: "Failed to create payment order"
**Fix:** Check gateway credentials are correct

## What to Share

Please share:
1. **Edge Function logs** (from Step 1) - This is the most important!
2. Result of Step 2 (column check)
3. Result of Step 3 (active gateway check)

