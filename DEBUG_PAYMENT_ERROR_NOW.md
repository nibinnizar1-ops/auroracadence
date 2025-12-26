# Debug Payment Error - Immediate Steps

## Critical: Check Edge Function Logs NOW

The error "Edge Function returned a non-2xx status code" is generic. We need the **exact error** from the logs.

### Step 1: Check Edge Function Logs (MOST IMPORTANT!)

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click on **`create-payment-order`**
3. Click on **"Logs"** tab
4. **Try to pay again** (click "Pay now" button)
5. **Look at the NEWEST log entry** (should be at the top, with red ERROR icon)
6. **Copy the ENTIRE error message**, including:
   - The error text
   - Status code (400, 401, 404, 500?)
   - Request URL
   - Any stack trace
   - The `environment` value (should be "live")
   - The `endpoint` value

### Step 2: Check Browser Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Click "Pay now" again
4. Look for any red error messages
5. Copy any errors you see

### Step 3: Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Click "Pay now" again
4. Look for request to `create-payment-order`
5. Click on it
6. Check:
   - **Status code** (200, 400, 500?)
   - **Response** tab - what error message?
   - **Request** tab - what was sent?

## Common Errors & Quick Fixes

### Error: "Invalid access key passed in header"
**Cause:** Wrong credentials or wrong endpoint
**Fix:**
- Verify credentials in admin panel
- Check `is_test_mode = false` for LIVE
- Verify access key starts with `ak_live_`

### Error: "No active payment gateway configured"
**Cause:** Gateway not activated
**Fix:**
- Go to admin panel → Payments → Gateways
- Activate Zwitch gateway

### Error: 404 Not Found
**Cause:** Wrong endpoint URL
**Fix:**
- Check logs show `environment: live`
- Check endpoint is `/pg/live/payment_token`
- Redeploy Edge Function if needed

### Error: 401 Unauthorized
**Cause:** Wrong authorization format
**Fix:**
- Verify Edge Function has: `Bearer ${accessKey}:${secretKey}`
- Redeploy if needed

## What I Need From You

**Please share:**
1. **The exact error from Edge Function logs** (Step 1) - This is critical!
2. **Any browser console errors** (Step 2)
3. **Network tab response** (Step 3)

Once I see the exact error, I can fix it immediately!

## Quick Verification

While checking logs, also verify:

```sql
SELECT 
  code, 
  is_active, 
  is_test_mode,
  credentials->>'access_key' as access_key_prefix
FROM payment_gateways 
WHERE code = 'zwitch' AND is_active = true;
```

**Expected:**
- `is_active = true`
- `is_test_mode = false`
- `access_key_prefix` starts with `ak_live_`

