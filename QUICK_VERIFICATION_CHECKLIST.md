# Quick Verification Checklist

Use this checklist to quickly verify everything is set up correctly.

## ✅ Database Check

```sql
-- 1. Check table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'payment_gateways'
);

-- 2. Check Zwitch gateway
SELECT 
  code, 
  name, 
  is_active, 
  is_test_mode,
  CASE WHEN credentials->>'access_key' IS NOT NULL THEN '✅' ELSE '❌' END as configured
FROM payment_gateways 
WHERE code = 'zwitch';

-- 3. Check orders table
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('payment_gateway_id', 'gateway_order_id');
```

**All should return results ✅**

## ✅ Admin Panel Check

1. Go to: `/admin/payments/gateways`
2. Zwitch should show:
   - ✅ Status: "Active" (green badge)
   - ✅ "Configured" status
   - ✅ Test Mode: OFF (for LIVE)

## ✅ Edge Functions Check

1. Supabase Dashboard → Edge Functions
2. Both functions should exist:
   - ✅ `create-payment-order`
   - ✅ `verify-payment`
3. Check "Last Updated" is recent

## ✅ Code Verification

### create-payment-order/index.ts should have:
- ✅ Line ~70: `const isLiveKey = accessKey?.startsWith("ak_live_");`
- ✅ Line ~71: `const environment = (isLiveKey || !config.isTestMode) ? "live" : "sandbox";`
- ✅ Line ~88: `"Authorization": \`Bearer ${accessKey}:${secretKey}\``

### verify-payment/index.ts should have:
- ✅ Line ~50: `const environment = config.isTestMode ? "sandbox" : "live";`
- ✅ Line ~65: `"Authorization": \`Bearer ${accessKey}:${secretKey}\``

## ✅ Test Payment

1. Add to cart → Checkout → Pay now
2. Should see:
   - ✅ No console errors
   - ✅ Zwitch modal opens
   - ✅ Payment form appears

## ✅ Logs Check

After clicking "Pay now", check Edge Function logs:

**create-payment-order logs should show:**
- ✅ `environment: live`
- ✅ `endpoint: .../pg/live/payment_token`
- ✅ `isLiveKey: true` (if using live key)
- ✅ No error messages

**If all checks pass, payment should work! ✅**

