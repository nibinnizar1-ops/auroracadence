# Get Exact Error Message - Step by Step

## The Problem
You're seeing: "Payment error: Edge Function returned a non-2xx status code"

This is a generic error. We need the **exact error** to fix it.

## Step 1: Check Edge Function Logs (CRITICAL!)

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Click **"Edge Functions"** in left sidebar

2. **Open create-payment-order Function**
   - Click on **`create-payment-order`** in the list
   - Click on **"Logs"** tab

3. **Trigger the Error**
   - Go back to your website
   - Try to pay again (click "Pay now")
   - **Immediately** go back to Supabase logs

4. **Find the Error**
   - Look at the **NEWEST log entry** (should be at the top)
   - Look for entries with **red ERROR** icon
   - Click on the error entry to expand it

5. **Copy the Error**
   - Copy the **entire error message**
   - Look for lines like:
     - `Error in create-payment-order: ...`
     - `Zwitch payment token creation failed: ...`
     - `Error creating payment order with gateway: ...`
   - Copy everything, including:
     - Error text
     - Status code
     - Request URL
     - Any JSON error response

## Step 2: Check Browser Console

1. **Open Browser DevTools**
   - Press **F12** (or Cmd+Option+I on Mac)
   - Click **"Console"** tab

2. **Clear Console**
   - Click the clear button (🚫 icon)

3. **Try Payment Again**
   - Click "Pay now" button
   - Watch the console

4. **Copy Errors**
   - Look for **red error messages**
   - Copy any errors related to:
     - `create-payment-order`
     - Payment
     - Edge Function

## Step 3: Check Network Tab

1. **Open Browser DevTools**
   - Press **F12**
   - Click **"Network"** tab

2. **Clear Network Log**
   - Click the clear button

3. **Try Payment Again**
   - Click "Pay now"
   - Look for request to `create-payment-order`

4. **Inspect the Request**
   - Click on the `create-payment-order` request
   - Check:
     - **Status:** (200, 400, 500?)
     - **Response** tab: What error message?
     - **Headers** tab: What was sent?

## What to Share

Please share:
1. **Exact error from Edge Function logs** (Step 1) - **MOST IMPORTANT!**
2. **Browser console errors** (Step 2)
3. **Network response** (Step 3)

## Common Errors You Might See

### "Invalid access key passed in header"
- **Fix:** Check credentials in admin panel

### "No active payment gateway configured"
- **Fix:** Activate gateway in admin panel

### 404 Not Found
- **Fix:** Check endpoint URL in logs

### 401 Unauthorized
- **Fix:** Check authorization format

## Quick Check While Debugging

Run this SQL to verify gateway:

```sql
SELECT 
  code, 
  is_active, 
  is_test_mode,
  LEFT(credentials->>'access_key', 20) as access_key
FROM payment_gateways 
WHERE code = 'zwitch' AND is_active = true;
```

**Expected:**
- `is_active = true`
- `is_test_mode = false`
- `access_key` starts with `ak_live_`

---

**The Edge Function logs will show the exact problem!** Please share what you see there.

