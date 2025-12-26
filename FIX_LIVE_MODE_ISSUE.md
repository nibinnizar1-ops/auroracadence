# Fix: Using Sandbox Endpoint with Live Credentials

## Problem

- **Database:** `is_test_mode = false` (LIVE mode)
- **Access Key:** `ak_live_...` (LIVE credentials)
- **But logs show:** Using `sandbox` endpoint
- **Error:** "Invalid access key passed in header. User not found"

## Root Cause

The code logic is correct, but there might be:
1. **Caching issue** - Old code still running
2. **Value not being read correctly** from database

## Immediate Fix

Since you have **LIVE credentials** and `is_test_mode = false`, let's ensure it uses LIVE endpoint:

### Option 1: Verify Database Value (Quick Check)

Run this to confirm:
```sql
SELECT code, is_test_mode, is_active 
FROM payment_gateways 
WHERE is_active = true;
```

**Expected:** `is_test_mode = false`

### Option 2: Force Live Mode (If needed)

If the value is correct but still using sandbox, we can add explicit logging:

The code should already be using:
```typescript
const environment = config.isTestMode ? "sandbox" : "live";
```

Since `is_test_mode = false`, it should use `live`.

### Option 3: Redeploy with Better Logging

I've added better logging. After redeploying, check logs for:
- `is_test_mode: false` (from database)
- `isTestMode: false` (in config)
- `environment: live` (should be live, not sandbox)

## Test Connection Button Fix

The "Test Connection" button is trying to call `test-gateway-connection` Edge Function which doesn't exist. We can:
1. Create that Edge Function, OR
2. Remove the test button for now

## Next Steps

1. **Redeploy** `create-payment-order` Edge Function with the new logging
2. **Try payment again**
3. **Check logs** - should show:
   - `is_test_mode: false`
   - `environment: live`
   - Endpoint: `/pg/live/payment_token`

If it still shows `sandbox`, there's a deeper issue we need to investigate.



