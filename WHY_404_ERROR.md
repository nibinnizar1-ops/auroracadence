# Why 404 Error is Happening

## The Error

```
"The route api/live/payment_token could not be found."
```

## Root Cause

The Zwitch API is receiving a request to:
```
api/live/payment_token
```

But it should be:
```
https://api.zwitch.io/v1/pg/live/payment_token
```

**The `/pg/` part is missing!**

## Why This Happens

Looking at the code, the endpoint is constructed as:
```typescript
const endpointUrl = `${apiBaseUrl}pg/${environment}/payment_token`;
```

Where:
- `apiBaseUrl = "https://api.zwitch.io/v1/"`
- `environment = "live"`

This should produce: `https://api.zwitch.io/v1/pg/live/payment_token`

**But the error shows Zwitch is receiving:** `api/live/payment_token`

## Possible Causes

### 1. URL Construction Issue
The string concatenation might be failing or the URL is being parsed incorrectly.

### 2. Base URL Override
If `config.config?.api_base_url` has a wrong value, it might override the hardcoded base URL.

### 3. URL Parsing
The fetch API might be parsing the URL incorrectly.

## The Fix

I've updated the code to:
1. **Hardcode the full endpoint URL** directly
2. **Remove all sandbox/test mode logic**
3. **Force production mode only**

**New code:**
```typescript
const apiBaseUrl = "https://api.zwitch.io/v1/";
const endpointUrl = `${apiBaseUrl}pg/live/payment_token`;
// Result: https://api.zwitch.io/v1/pg/live/payment_token
```

This ensures the URL is always correct and includes the `/pg/` part.

## Verification

After redeploying, check the Edge Function logs. You should see:
```json
{
  "endpoint": "https://api.zwitch.io/v1/pg/live/payment_token",
  "fullUrl": "https://api.zwitch.io/v1/pg/live/payment_token"
}
```

If the logs show the correct URL but you still get 404, then:
1. Check if Zwitch API endpoint has changed
2. Verify your access key is for production
3. Check Zwitch documentation for correct endpoint

