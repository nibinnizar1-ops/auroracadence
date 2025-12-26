# Quick Fix: Force Live Mode

Since your database shows `is_test_mode = false` but logs show it's using `sandbox`, let's add a safety check:

## The Issue

Your logs show:
- Environment: `sandbox`
- But database: `is_test_mode = false`

This suggests the value isn't being read correctly or there's caching.

## Immediate Solution

I've added better logging. Now:

1. **Redeploy** `create-payment-order` Edge Function
2. **Try payment again**
3. **Check logs** - should now show:
   - `is_test_mode: false` (from database)
   - `isTestMode: false` (in config)
   - `environment: live` (should be live!)

## If Still Using Sandbox

If logs still show `sandbox` even though `is_test_mode = false`, we can add an explicit check:

```typescript
// Force live if access key starts with "ak_live_"
const isLiveKey = accessKey?.startsWith("ak_live_");
const environment = (isLiveKey || !config.isTestMode) ? "live" : "sandbox";
```

But first, let's see what the new logs show after redeploying!

## Test Connection Button

The "Test Connection" button error is because it's calling a non-existent Edge Function. We can fix this later - the main payment flow is more important right now.

## Action Items

1. ✅ Redeploy `create-payment-order` Edge Function
2. ✅ Try payment
3. ✅ Check logs for the new detailed output
4. ✅ Share the logs if it still shows `sandbox`



