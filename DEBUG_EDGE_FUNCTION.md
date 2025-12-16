# Debug Edge Function 500 Error

Since the gateway is configured and migration is applied, the issue is likely in the Edge Function execution itself.

## Step 1: Check Edge Function Logs (CRITICAL!)

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click on **`create-payment-order`**
3. Click **"Logs"** tab
4. Try to pay again
5. **Look for the red error message** - this is the exact error

**The logs will show:**
- Which line failed
- What the error message is
- Stack trace

## Step 2: Verify Credentials Format

Run this SQL to check the exact credentials structure:

```sql
SELECT 
  id, 
  name, 
  code, 
  is_active,
  credentials,
  jsonb_object_keys(credentials) as credential_keys
FROM public.payment_gateways 
WHERE is_active = true;
```

**Expected for Zwitch:**
- `credential_keys` should show: `access_key`, `secret_key`
- `credentials` should be: `{"access_key": "...", "secret_key": "..."}`

## Step 3: Test Gateway API Directly

The Edge Function might be failing when calling the Zwitch API. Check:

1. **API URL**: Is `https://api.zwitch.io/v1/` accessible?
2. **Credentials**: Are they valid?
3. **Amount**: Is it in the correct format?

## Step 4: Common Issues

### Issue: "Failed to create Zwitch payment token"
**Possible causes:**
- Invalid credentials
- Wrong API endpoint
- Network issue
- Invalid request format

**Fix:** Check Zwitch API documentation and verify credentials

### Issue: "Failed to create order in database"
**Possible causes:**
- Missing required fields
- RLS policy blocking
- Invalid data format

**Fix:** Check order creation logs

### Issue: "No active payment gateway configured"
**Fix:** Even though SQL shows configured, Edge Function might not see it
- Check RLS policies on `payment_gateways` table
- Verify Edge Function has service role key

## What I've Added

I've improved error handling to:
1. Catch gateway errors separately
2. Clean up failed orders
3. Provide more detailed error messages

## Next Steps

1. **Check Edge Function logs** (Step 1) - This is the most important!
2. **Share the exact error message** from logs
3. **Verify credentials format** (Step 2)
4. **Check if it's a gateway API issue** (Step 3)

Once you share the logs, I can provide a specific fix!

