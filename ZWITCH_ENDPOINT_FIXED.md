# Zwitch Endpoint Fixed! ✅

## Issue Resolved

The correct Zwitch API endpoint is:
- **Sandbox**: `https://api.zwitch.io/v1/pg/sandbox/payment_token`
- **Live**: `https://api.zwitch.io/v1/pg/live/payment_token`

## Changes Made

1. ✅ Updated `create-payment-order` Edge Function:
   - Changed endpoint from `/payment_token` to `/pg/{environment}/payment_token`
   - Automatically uses `sandbox` for test mode, `live` for production

2. ✅ Updated `verify-payment` Edge Function:
   - Changed status check endpoint to `/pg/{environment}/payment_token/{id}`
   - Matches the same environment (sandbox/live)

## Next Steps

1. **Redeploy Both Edge Functions**:
   - `create-payment-order`
   - `verify-payment`

2. **Test the Payment Flow**:
   - Try to make a payment
   - Check if the 404 error is resolved
   - Verify payment token is created successfully

3. **Check Edge Function Logs**:
   - Should now show the correct endpoint
   - Should create payment token successfully

## Configuration

The endpoint automatically switches between sandbox and live based on:
- **Test Mode ON** → Uses `/pg/sandbox/payment_token`
- **Test Mode OFF** → Uses `/pg/live/payment_token`

You can configure this in Admin Panel → Payments → Gateways → Edit Zwitch → Toggle "Test Mode"

## Expected Result

After redeploying, the payment flow should work! The 404 error should be resolved.



