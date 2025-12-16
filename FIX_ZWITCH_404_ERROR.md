# Fix Zwitch 404 Error

## Issue Found

The logs show:
```
ERROR Zwitch payment token creation failed: { status: 404, statusText: "Not Found", error: "Not Found", requestUrl: "https://api.zwitch.io/v1/payment_token" }
```

## Root Cause

Looking at the old working code (`create-razorpay-order`), it was sending:
- `amount: orderTotal` (in **rupees**, not paise)

But I had changed it to convert to paise, which might be causing the issue. However, the 404 suggests the **endpoint itself** might be wrong or the API structure has changed.

## Fix Applied

I've reverted the amount conversion - Zwitch expects amount in **rupees**, not paise (based on the old working code).

## Next Steps

1. **Redeploy the Edge Function** with the updated code
2. **Try paying again**
3. **Check the logs** - if still 404, we need to verify:
   - The correct Zwitch API endpoint
   - Your Zwitch credentials are valid
   - The API structure matches what Zwitch expects

## Alternative: Check Zwitch Documentation

If the 404 persists after redeploying, we may need to:
1. Check Zwitch API documentation for the correct endpoint
2. Verify your Zwitch account is active
3. Check if Zwitch API has changed

## Quick Test

After redeploying, the logs should show:
- If successful: `INFO Active gateway found` → Payment token created
- If still failing: Check the exact error message

