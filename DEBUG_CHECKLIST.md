# Debug Checklist - Step by Step

## Step 1: Verify Code is Actually Deployed ✅

1. Go to **Supabase Dashboard** → **Edge Functions** → **`create-payment-order`**
2. Click **"Code"** tab
3. **Search for** `pg/sandbox` (Ctrl+F or Cmd+F)
   - ✅ **If found:** Code is deployed correctly
   - ❌ **If NOT found:** Code wasn't deployed - need to redeploy

4. **Search for** `accessKey:${secretKey}`
   - ✅ **If found:** Authorization fix is deployed
   - ❌ **If NOT found:** Need to redeploy with fix

**If code is NOT deployed:**
- Copy entire `supabase/functions/create-payment-order/index.ts`
- Paste in Code tab
- Click **"Deploy"**

## Step 2: Check Edge Function Logs (CRITICAL!) 🔍

1. Go to **Supabase Dashboard** → **Edge Functions** → **`create-payment-order`**
2. Click **"Logs"** tab
3. **Try to pay again** (click "Pay now")
4. **Look at the NEWEST log entry** (top of the list)
5. **Copy the ENTIRE error message**, including:
   - Status code (401, 404, 400, 500?)
   - Error message text
   - Request URL
   - Any stack trace

**This is the most important step!** The logs will show exactly what's failing.

## Step 3: Verify Gateway Configuration 🔧

Run this SQL in Supabase SQL Editor:

```sql
SELECT 
  code, 
  name, 
  is_active, 
  is_test_mode,
  CASE 
    WHEN credentials->>'access_key' IS NOT NULL THEN '✅ Has Access Key'
    ELSE '❌ Missing Access Key'
  END as access_key_status,
  CASE 
    WHEN credentials->>'secret_key' IS NOT NULL THEN '✅ Has Secret Key'
    ELSE '❌ Missing Secret Key'
  END as secret_key_status
FROM payment_gateways 
WHERE is_active = true;
```

**Expected:**
- `is_active = true`
- `is_test_mode = true` (for sandbox) or `false` (for live)
- Both keys should show "✅ Has"

## Step 4: Test the Endpoint Manually (Optional) 🧪

If you want to test the Zwitch API directly:

```bash
curl -X POST https://api.zwitch.io/v1/pg/sandbox/payment_token \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_KEY:YOUR_SECRET_KEY" \
  -d '{
    "amount": 100,
    "currency": "INR",
    "contact_number": "1234567890",
    "email_id": "test@example.com",
    "mtx": "TEST123"
  }'
```

Replace `YOUR_ACCESS_KEY` and `YOUR_SECRET_KEY` with actual values.

## What to Share With Me

Please share:
1. ✅ **Result of Step 1** (Is code deployed?)
2. 🔍 **Exact error from Step 2** (Edge Function logs) - **MOST IMPORTANT!**
3. 🔧 **Result of Step 3** (Gateway configuration)

Once I see the exact error from the logs, I can fix it immediately!



