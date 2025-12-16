# Debug "Failed to initiate payment" Error

## Quick Checks

### 1. Check Browser Console
Open browser DevTools (F12) → Console tab
Look for any red error messages when clicking "Pay now"
Common errors:
- "No active payment gateway configured"
- "Failed to load [Gateway] SDK"
- Edge Function errors

### 2. Check Network Tab
Open browser DevTools (F12) → Network tab
Click "Pay now" and look for:
- Request to `create-payment-order` Edge Function
- Check the response status (200, 400, 500?)
- Check the response body for error messages

### 3. Check Active Gateway
Run this SQL in Supabase SQL Editor:

```sql
SELECT id, name, code, is_active, 
       CASE WHEN credentials = '{}'::jsonb THEN 'Not Configured' ELSE 'Configured' END as status
FROM public.payment_gateways 
WHERE is_active = true;
```

**Expected:** Should return 1 row with `is_active = true` and `status = 'Configured'`

**If no results:**
1. Go to Admin Panel → Payments → Gateways
2. Configure a gateway (enter credentials)
3. Click "Activate"

### 4. Check Edge Functions
Go to Supabase Dashboard → Edge Functions
Verify these functions exist:
- ✅ `create-payment-order`
- ✅ `verify-payment`

If they don't exist, deploy them using the files:
- `supabase/functions/create-payment-order/index.ts`
- `supabase/functions/verify-payment/index.ts`

### 5. Check Edge Function Logs
Go to Supabase Dashboard → Edge Functions → `create-payment-order` → Logs
Look for error messages when you try to pay

## Common Issues & Fixes

### Issue: "No active payment gateway configured"
**Fix:** Activate a gateway in Admin Panel → Payments → Gateways

### Issue: Edge Function returns 404
**Fix:** Deploy the Edge Functions (see deployment guide)

### Issue: Edge Function returns 500
**Fix:** Check Edge Function logs for specific error

### Issue: "Failed to load [Gateway] SDK"
**Fix:** Check internet connection, SDK URL might be blocked

### Issue: CORS error
**Fix:** Edge Function should have CORS headers (already included)

## Next Steps

1. Check browser console for exact error message
2. Check Edge Function logs
3. Verify active gateway exists
4. Share the error message you see

