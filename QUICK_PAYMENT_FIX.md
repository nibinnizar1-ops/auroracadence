# Quick Fix for "Failed to initiate payment"

## Step 1: Check Browser Console
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to **Console** tab
3. Click "Pay now" button
4. Look for **red error messages**
5. **Copy the exact error message** and share it

## Step 2: Check Active Gateway

Run this SQL in Supabase SQL Editor:

```sql
SELECT id, name, code, is_active, 
       CASE WHEN credentials = '{}'::jsonb THEN 'Not Configured' ELSE 'Configured' END as status
FROM public.payment_gateways 
WHERE is_active = true;
```

**If no results or status is "Not Configured":**
1. Go to Admin Panel → Payments → Gateways
2. Click "Configure" on Zwitch (or any gateway)
3. Enter your credentials:
   - Zwitch: Access Key, Secret Key
4. Click "Save Configuration"
5. Go back to list
6. Click "Activate"

## Step 3: Check Edge Functions

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Verify these functions exist:
   - `create-payment-order` ✅
   - `verify-payment` ✅

**If they don't exist:**
- Deploy them using the standalone files I created
- See `EDGE_FUNCTION_DEPLOYMENT_FIXED.md`

## Step 4: Check Edge Function Logs

1. Go to **Supabase Dashboard** → **Edge Functions** → `create-payment-order`
2. Click **"Logs"** tab
3. Try to pay again
4. Check for error messages in logs

## Common Errors & Fixes

### Error: "No active payment gateway configured"
**Fix:** Activate a gateway in admin panel (see Step 2)

### Error: "Function not found" or 404
**Fix:** Deploy Edge Functions (see Step 3)

### Error: "Failed to load [Gateway] SDK"
**Fix:** Check internet connection, SDK URL might be blocked

### Error: Edge Function returns 500
**Fix:** Check Edge Function logs for specific error

## What to Share

Please share:
1. **Browser console error** (exact message)
2. **Network tab** - Check the request to `create-payment-order`:
   - Status code (200, 400, 500?)
   - Response body
3. **Edge Function logs** (if available)

This will help me identify the exact issue!

