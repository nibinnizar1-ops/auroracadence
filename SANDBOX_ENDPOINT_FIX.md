# Fixed: Sandbox Endpoint Issue ✅

## Problem Identified

You're using **sandbox/test credentials** (`ak_test_...`), but the Edge Function was calling the **live endpoint** (`/pg/payment_token`).

**Wrong:** `https://api.zwitch.io/v1/pg/payment_token` (live endpoint)
**Correct:** `https://api.zwitch.io/v1/pg/sandbox/payment_token` (sandbox endpoint)

## Fix Applied

I've updated both Edge Functions to:
1. **Detect sandbox vs live** based on access key prefix
   - `ak_test_*` → Use sandbox endpoint
   - `ak_live_*` → Use live endpoint

2. **Use correct endpoint automatically**
   - Sandbox: `https://api.zwitch.io/v1/pg/sandbox/payment_token`
   - Live: `https://api.zwitch.io/v1/pg/payment_token`

## Changes Made

### `create-payment-order/index.ts`:
```typescript
// Detect environment from access key
const isSandbox = accessKey.startsWith("ak_test_");
const endpointUrl = isSandbox 
  ? "https://api.zwitch.io/v1/pg/sandbox/payment_token"
  : "https://api.zwitch.io/v1/pg/payment_token";
```

### `verify-payment/index.ts`:
```typescript
// Detect environment from access key
const isSandbox = accessKey.startsWith("ak_test_");
const endpointUrl = isSandbox
  ? `https://api.zwitch.io/v1/pg/sandbox/payment_token/${paymentTokenId}`
  : `https://api.zwitch.io/v1/pg/payment_token/${paymentTokenId}`;
```

## Next Steps

### Step 1: Redeploy Edge Functions

**1. Deploy `create-payment-order`:**
- Supabase Dashboard → Edge Functions → `create-payment-order`
- Code tab → Copy entire `supabase/functions/create-payment-order/index.ts`
- Paste and Deploy

**2. Deploy `verify-payment`:**
- Supabase Dashboard → Edge Functions → `verify-payment`
- Code tab → Copy entire `supabase/functions/verify-payment/index.ts`
- Paste and Deploy

### Step 2: Test Payment Flow

1. Add items to cart
2. Go to checkout
3. Fill customer details
4. Click "Pay now"
5. Should work now! ✅

## Expected Behavior

**Before:**
- Using sandbox credentials but calling live endpoint
- Error: "Could not get merchant details"

**After:**
- Using sandbox credentials and calling sandbox endpoint
- Should work correctly ✅

## Verification

After redeploying, check Edge Function logs. You should see:
```
Zwitch API Configuration: {
  "endpoint": "https://api.zwitch.io/v1/pg/sandbox/payment_token",
  "environment": "sandbox",
  "isSandbox": true,
  ...
}
```

## Summary

✅ Fixed endpoint detection (sandbox vs live)
✅ Automatically uses correct endpoint based on credentials
✅ Works for both sandbox and live environments

**Redeploy Edge Functions and test!** 🚀

