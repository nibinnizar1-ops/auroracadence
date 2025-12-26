# Debug Payment Error - Step by Step

## Step 1: Verify Edge Function is Deployed with New Code

1. Go to **Supabase Dashboard** → **Edge Functions** → **`create-payment-order`**
2. Click **"Code"** tab
3. **Search for** `pg/sandbox` in the code
4. **If you DON'T see `pg/sandbox`**, the new code wasn't deployed!

**If not deployed:**
- Copy entire contents of `supabase/functions/create-payment-order/index.ts`
- Paste in the Code editor
- Click **"Deploy"**

## Step 2: Check Edge Function Logs (CRITICAL!)

1. Go to **Supabase Dashboard** → **Edge Functions** → **`create-payment-order`**
2. Click **"Logs"** tab
3. **Try to pay again** (click "Pay now")
4. **Look for the NEWEST error** (should be at the top)
5. **Copy the ENTIRE error message** including:
   - Error text
   - Status code
   - Request URL
   - Any stack trace

## Step 3: Verify Gateway Configuration

Run this SQL to check your gateway:

```sql
SELECT 
  id, 
  name, 
  code, 
  is_active, 
  is_test_mode,
  credentials->>'access_key' as access_key_exists,
  credentials->>'secret_key' as secret_key_exists
FROM public.payment_gateways 
WHERE is_active = true;
```

**Expected:**
- `is_active = true`
- `is_test_mode = true` (for sandbox) or `false` (for live)
- Both `access_key_exists` and `secret_key_exists` should show values

## Step 4: Common Issues

### Issue: Still getting 404
**Check:**
- Is the endpoint showing `pg/sandbox/payment_token` in logs?
- Is `is_test_mode` set correctly?

### Issue: 401 Unauthorized
**Check:**
- Are credentials correct?
- Is the secret key valid?

### Issue: 400 Bad Request
**Check:**
- Request body format
- Required fields missing

## What to Share

Please share:
1. **Edge Function Logs** (from Step 2) - This is the most important!
2. **Result of Step 3** (gateway configuration)
3. **Whether you see `pg/sandbox` in the code** (Step 1)

This will help me identify the exact issue!



