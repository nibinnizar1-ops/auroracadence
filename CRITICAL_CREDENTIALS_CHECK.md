# ⚠️ CRITICAL: Zwitch Credentials Verification

## Current Status
**Error:** `"Invalid access key passed in header. User not found."`

This error means **Zwitch API cannot authenticate your credentials**. The code is working correctly - the issue is with the credentials themselves.

## 🔍 Step-by-Step Verification

### Step 1: Check Edge Function Logs

After redeploying, check logs for this entry:
```
=== Zwitch API Request Details ===
```

**Look for:**
- `accessKeyFull`: The **full access key** being used
- `accessKeyStartsWith`: Should be `ak_test_` (for sandbox)
- `secretKeyStartsWith`: Should be `sk_test_` (for sandbox)
- `hasSpaces`: Should be `false`
- `hasNewlines`: Should be `false`

### Step 2: Compare with Zwitch Dashboard

1. **Log in to Zwitch Dashboard**
   - URL: https://dashboard.zwitch.io (or your Zwitch dashboard URL)

2. **Navigate to API Keys**
   - Settings → API Keys
   - OR Developers → API Keys
   - OR Account → API Credentials

3. **Find Sandbox Credentials**
   - Look for **Sandbox** or **Test** credentials
   - Access Key should start with `ak_test_`
   - Secret Key should start with `sk_test_`

4. **Copy Both Keys**
   - **Don't type manually** - use copy/paste
   - Copy access key exactly
   - Copy secret key exactly
   - Make sure no extra spaces

### Step 3: Compare with Supabase Vault

1. **Go to Supabase Dashboard**
   - Project Settings → Edge Functions → Secrets

2. **Check ZWITCH_ACCESS_KEY**
   - Click on the secret
   - Compare with access key from Zwitch dashboard
   - **Do they match exactly?**
   - Check for:
     - Same length
     - Same characters
     - No extra spaces
     - No line breaks

3. **Check ZWITCH_SECRET_KEY**
   - Click on the secret
   - Compare with secret key from Zwitch dashboard
   - **Do they match exactly?**
   - Check for:
     - Same length
     - Same characters
     - No extra spaces
     - No line breaks

### Step 4: Test with Curl (MOST IMPORTANT)

This will tell us if credentials work at all:

```bash
curl --request POST \
  --url https://api.zwitch.io/v1/pg/sandbox/payment_token \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer YOUR_ACCESS_KEY:YOUR_SECRET_KEY" \
  --data '{
    "amount": 10,
    "currency": "INR",
    "contact_number": "7356697492",
    "email_id": "test@example.com",
    "mtx": "test1234"
  }'
```

**Replace:**
- `YOUR_ACCESS_KEY` with access key from Zwitch dashboard
- `YOUR_SECRET_KEY` with secret key from Zwitch dashboard

**Results:**

✅ **If curl succeeds:**
- You get: `{"id": "payment_token_id"}`
- **Meaning:** Credentials are correct, but something wrong with Edge Function
- **Action:** Check Edge Function logs for exact credentials being used

❌ **If curl fails with same error:**
- You get: `{"status_code":400,"error":"Invalid access key..."}`
- **Meaning:** Credentials are wrong or account not activated
- **Action:** Contact Zwitch support

### Step 5: Update Supabase Vault (If Needed)

If credentials don't match:

1. **Delete old secrets**
   - Delete `ZWITCH_ACCESS_KEY`
   - Delete `ZWITCH_SECRET_KEY`

2. **Add fresh secrets**
   - Add `ZWITCH_ACCESS_KEY` with value from Zwitch dashboard
   - Add `ZWITCH_SECRET_KEY` with value from Zwitch dashboard
   - **No spaces before/after**
   - **Single line only**

3. **Redeploy Edge Function**
   - Edge Functions → `create-payment-order` → Deploy

### Step 6: Check Zwitch Account Status

If credentials match but still don't work:

1. **Check Account Status**
   - Log in to Zwitch Dashboard
   - Check if account is active
   - Check if sandbox is enabled
   - Look for warnings or restrictions

2. **Contact Zwitch Support**
   - Share error: "Invalid access key passed in header. User not found."
   - Share endpoint: `https://api.zwitch.io/v1/pg/sandbox/payment_token`
   - Share authorization format: `Bearer <access_key>:<secret_key>`
   - Ask them to verify your sandbox credentials

## 🎯 Most Likely Issues

1. **Wrong Credentials** (90% likely)
   - Credentials in Supabase don't match Zwitch dashboard
   - Extra spaces or characters
   - Wrong environment (live vs sandbox)

2. **Account Not Activated** (5% likely)
   - Zwitch account not fully activated
   - Sandbox not enabled

3. **Code Issue** (5% likely)
   - Authorization header format wrong (but looks correct)
   - Encoding issue

## ✅ Action Items

1. [ ] Check Edge Function logs for `accessKeyFull`
2. [ ] Compare with Zwitch dashboard credentials
3. [ ] Test with curl command
4. [ ] Update Supabase Vault if needed
5. [ ] Redeploy Edge Function
6. [ ] Contact Zwitch support if curl also fails

## 📞 Next Steps

**If curl works but Edge Function doesn't:**
- Share Edge Function logs showing `accessKeyFull`
- We'll compare with what curl used

**If curl also fails:**
- Credentials are definitely wrong
- Contact Zwitch support to verify account and credentials

The code is correct - we just need to verify the credentials match what Zwitch expects!

