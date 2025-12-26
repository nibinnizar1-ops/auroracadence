# Debugging Edge Function Errors

## Common Issues & Solutions

### 1. Amount Conversion Issue ✅ FIXED
**Problem:** Edge Function was dividing amount by 100, but frontend sends rupees directly.
**Fix:** Removed `/100` conversion - now uses amount directly.

### 2. JSON Parsing Errors
**Problem:** Request body might not be valid JSON.
**Fix:** Added try-catch around JSON parsing with detailed error messages.

### 3. Missing Environment Variables
**Problem:** Supabase URL or Service Key not configured.
**Fix:** Added validation checks before using environment variables.

### 4. Validation Errors
**Problem:** Generic error messages don't help debug.
**Fix:** Added detailed validation with specific error messages.

## How to Debug

### Step 1: Check Edge Function Logs
1. Go to Supabase Dashboard
2. Edge Functions → `create-payment-order`
3. Click "Logs" tab
4. Look for error messages

### Step 2: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Step 3: Verify Credentials
1. Supabase Dashboard → Project Settings → Edge Functions → Secrets
2. Verify `ZWITCH_ACCESS_KEY` exists
3. Verify `ZWITCH_SECRET_KEY` exists
4. Check if they start with `ak_test_` and `sk_test_` (for sandbox)

### Step 4: Test with Curl
```bash
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/create-payment-order \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 10,
    "currency": "INR",
    "customerInfo": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "1234567890",
      "address": "123 Test St",
      "city": "Test City",
      "state": "Test State",
      "pincode": "123456"
    },
    "items": [{
      "id": "test-id",
      "title": "Test Product",
      "price": 10,
      "quantity": 1
    }]
  }'
```

## What to Look For in Logs

1. **"Reading Zwitch credentials from Vault"** - Should show credentials found
2. **"Zwitch API Configuration"** - Should show correct endpoint (sandbox/live)
3. **"Zwitch API Error"** - If this appears, check the error message
4. **"Order created in database"** - Should appear before calling Zwitch API

## Next Steps

1. Redeploy the Edge Function with fixes
2. Test payment flow
3. Check logs for any remaining errors
4. Share error logs if issue persists
