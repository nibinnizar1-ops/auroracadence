# Why 404 Error is Happening & Fix Applied

## The Error

```
"The route api/live/payment_token could not be found."
```

## Root Cause Analysis

### What Zwitch API Received:
```
api/live/payment_token
```

### What Zwitch API Expects:
```
https://api.zwitch.io/v1/pg/live/payment_token
```

**Problem:** The `/pg/` part is missing from the URL!

## Why This Happened

The code was constructing the URL as:
```typescript
const endpointUrl = `${apiBaseUrl}pg/${environment}/payment_token`;
```

Where:
- `apiBaseUrl = "https://api.zwitch.io/v1/"`
- `environment = "live"`

This **should** produce: `https://api.zwitch.io/v1/pg/live/payment_token`

But Zwitch is receiving: `api/live/payment_token` (missing `/pg/` and base URL)

### Possible Causes:

1. **URL Construction Issue**: The string concatenation might have failed
2. **Base URL Override**: Config might have wrong `api_base_url` value
3. **URL Parsing**: Fetch API might be parsing URL incorrectly
4. **Environment Variable**: Something might be overriding the base URL

## The Fix Applied

### 1. Removed All Sandbox References
- Removed `isTestMode` checks
- Removed `sandbox` environment logic
- Removed `isLiveKey` detection
- **Production only** now

### 2. Hardcoded Production Endpoint
```typescript
// Before (with variables):
const environment = (isLiveKey || !config.isTestMode) ? "live" : "sandbox";
const endpointUrl = `${apiBaseUrl}pg/${environment}/payment_token`;

// After (hardcoded):
const endpointUrl = `${apiBaseUrl}pg/live/payment_token`;
// Result: https://api.zwitch.io/v1/pg/live/payment_token
```

### 3. Simplified Code
- Removed all conditional logic
- Direct endpoint construction
- Clear logging

## Changes Made

### `create-payment-order/index.ts`:
```typescript
// Zwitch API - Production Only
const apiBaseUrl = "https://api.zwitch.io/v1/";
const endpointUrl = `${apiBaseUrl}pg/live/payment_token`;
```

### `verify-payment/index.ts`:
```typescript
// Zwitch API - Production Only
const apiBaseUrl = "https://api.zwitch.io/v1/";
const statusResponse = await fetch(
  `${apiBaseUrl}pg/live/payment_token/${paymentTokenId}`,
  ...
);
```

## Next Steps

1. **Redeploy Edge Functions:**
   - Deploy `create-payment-order`
   - Deploy `verify-payment`

2. **Test Payment:**
   - Try payment again
   - Check Edge Function logs
   - Verify endpoint shows: `https://api.zwitch.io/v1/pg/live/payment_token`

3. **Verify in Logs:**
   After redeploying, logs should show:
   ```json
   {
     "endpoint": "https://api.zwitch.io/v1/pg/live/payment_token",
     "fullUrl": "https://api.zwitch.io/v1/pg/live/payment_token"
   }
   ```

## Expected Result

✅ Endpoint: `https://api.zwitch.io/v1/pg/live/payment_token`
✅ No more 404 errors
✅ Payment token created successfully

## If Still Getting 404

If you still get 404 after redeploying:

1. **Check Edge Function logs** - Verify the exact URL being sent
2. **Verify Zwitch API documentation** - Check if endpoint has changed
3. **Check access key** - Ensure it's a production key (`ak_live_...`)
4. **Test with curl** - Try the exact endpoint manually

The fix ensures the URL is always correct with `/pg/` included!

