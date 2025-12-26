# Fix: Endpoint Missing /pg/ Path

## Problem Identified ✅

**Error from Zwitch API:**
```
"The route api/live/payment_token could not be found."
```

**Expected endpoint:**
```
https://api.zwitch.io/v1/pg/live/payment_token
```

**What's happening:**
The endpoint is missing the `/pg/` part. Zwitch is receiving `api/live/payment_token` instead of `api/pg/live/payment_token`.

## Root Cause

The code was using `config.config?.api_base_url` which might have a wrong value, or the URL construction was incorrect.

## Fix Applied

I've updated the code to:
1. **Hardcode the base URL** to `https://api.zwitch.io/v1/` (ignore config)
2. **Ensure `/pg/` is always included** in the path
3. **Add detailed logging** to see exactly what URL is being constructed

## Next Steps

### 1. Redeploy Edge Function (CRITICAL!)

1. Go to **Supabase Dashboard** → **Edge Functions** → **`create-payment-order`**
2. Click **"Code"** tab
3. **Copy entire contents** of `supabase/functions/create-payment-order/index.ts`
4. **Paste** into Supabase editor
5. Click **"Deploy"**

### 2. Test Payment Again

1. Try to pay again
2. Check Edge Function logs
3. Look for the log entry: `"Zwitch API Configuration:"`
4. Verify `finalEndpoint` shows: `https://api.zwitch.io/v1/pg/live/payment_token`

### 3. Verify in Logs

After redeploying, the logs should show:
```json
{
  "apiBaseUrl": "https://api.zwitch.io/v1/",
  "environment": "live",
  "finalEndpoint": "https://api.zwitch.io/v1/pg/live/payment_token",
  "endpointParts": {
    "base": "https://api.zwitch.io/v1/",
    "path": "pg/live/payment_token",
    "full": "https://api.zwitch.io/v1/pg/live/payment_token"
  }
}
```

## Expected Result

After redeploying:
- ✅ Endpoint should be: `https://api.zwitch.io/v1/pg/live/payment_token`
- ✅ No more 404 errors
- ✅ Payment token should be created successfully

## What Changed

**Before:**
- Used `config.config?.api_base_url` (could be wrong)
- URL might have been constructed incorrectly

**After:**
- Hardcoded base URL: `https://api.zwitch.io/v1/`
- Always includes `/pg/` in path
- Better logging to debug

**Redeploy and test!** The endpoint should now be correct. 🚀

