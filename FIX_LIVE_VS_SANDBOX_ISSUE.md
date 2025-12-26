# Fix: Live vs Sandbox Endpoint Mismatch

## Problem Identified ✅

**From the logs:**
- Error: "Invalid access key passed in header. User not found"
- Status: 400 Bad Request
- Request URL: `https://api.zwitch.io/v1/pg/sandbox/payment_token`
- Environment: `sandbox`

**From database:**
- `is_test_mode = false` (LIVE mode)
- Access Key: `ak_live_...` (LIVE key)

**THE ISSUE:**
- Gateway is configured for **LIVE mode** (`is_test_mode = false`)
- But code is using **SANDBOX endpoint** (`/pg/sandbox/payment_token`)
- LIVE access key doesn't work with SANDBOX endpoint!

## Solution

You have **two options**:

### Option 1: Use LIVE Mode (Recommended for Production)
Since you have LIVE credentials (`ak_live_...`), use LIVE mode:

1. **Verify gateway is set to LIVE:**
   ```sql
   SELECT is_test_mode FROM payment_gateways WHERE is_active = true;
   -- Should be: false
   ```

2. **The code should automatically use `/pg/live/payment_token`**
   - If `is_test_mode = false` → uses `live`
   - If `is_test_mode = true` → uses `sandbox`

3. **Redeploy Edge Function** to ensure code is correct

### Option 2: Switch to SANDBOX Mode (For Testing)
If you want to test with sandbox:

1. **Update gateway to test mode:**
   ```sql
   UPDATE payment_gateways 
   SET is_test_mode = true 
   WHERE code = 'zwitch' AND is_active = true;
   ```

2. **Use SANDBOX credentials** (not LIVE credentials)

## Quick Fix: Verify Code Logic

The code should be:
```typescript
const environment = config.isTestMode ? "sandbox" : "live";
```

This means:
- `is_test_mode = true` → `sandbox`
- `is_test_mode = false` → `live`

## Check Current Behavior

The logs show it's using `sandbox` even though `is_test_mode = false`. This suggests:
1. Either the code isn't reading `is_test_mode` correctly
2. Or the value is being overridden somewhere

Let me check the code to ensure it's reading the value correctly.



