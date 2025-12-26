# Debugging Zwitch Credentials Issue

## Current Error
```
"Invalid access key passed in header. User not found."
```

## What We Know

✅ **Code is working correctly:**
- Reading credentials from Supabase Vault ✅
- Detecting sandbox environment ✅
- Using correct endpoint ✅
- Authorization header format looks correct ✅

❌ **Zwitch API is rejecting credentials:**
- Returns 400 Bad Request
- Says "Invalid access key" or "User not found"

## Debugging Steps

### Step 1: Check Edge Function Logs

After redeploying with the updated code, check logs for:

```
=== Zwitch API Request Details ===
```

Look for:
- `accessKeyFull`: The full access key being used
- `hasSpaces`: Should be `false` (no spaces in keys)
- `hasNewlines`: Should be `false` (no line breaks)
- `accessKeyStartsWith`: Should be `ak_test_` or `ak_live_`
- `secretKeyStartsWith`: Should be `sk_test_` or `sk_live_`

### Step 2: Verify Credentials Match Zwitch Dashboard

1. **Log in to Zwitch Dashboard**
2. **Go to API Keys section**
3. **Compare with Supabase Vault:**
   - Access Key in Zwitch = Access Key in Supabase Vault?
   - Secret Key in Zwitch = Secret Key in Supabase Vault?
   - Make sure they match **exactly**

### Step 3: Test with Curl (Critical Test)

Test credentials directly with Zwitch API:

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
- `YOUR_ACCESS_KEY` with your actual access key from Zwitch
- `YOUR_SECRET_KEY` with your actual secret key from Zwitch

**Expected Results:**

✅ **Success Response:**
```json
{
  "id": "payment_token_id_here"
}
```

❌ **If you get "Invalid access key":**
- Credentials are wrong
- Account not activated
- Wrong environment (sandbox vs live)

### Step 4: Check for Common Issues

#### Issue 1: Extra Spaces
- **Problem:** Credentials have leading/trailing spaces
- **Fix:** Trim in Supabase Vault (remove spaces before/after)

#### Issue 2: Wrong Environment
- **Problem:** Using live credentials with sandbox endpoint (or vice versa)
- **Fix:** Make sure `ak_test_` keys use sandbox endpoint

#### Issue 3: Account Not Activated
- **Problem:** Zwitch account not fully activated
- **Fix:** Contact Zwitch support to activate account

#### Issue 4: Credentials Don't Match
- **Problem:** Access key and secret key from different accounts
- **Fix:** Get both from same Zwitch account

### Step 5: Try Alternative Authorization Format

If Bearer doesn't work, Zwitch might expect Basic auth. But based on documentation, Bearer should be correct.

## What to Share with Zwitch Support

If curl test also fails, contact Zwitch support with:

1. **Error message:** "Invalid access key passed in header. User not found."
2. **Endpoint used:** `https://api.zwitch.io/v1/pg/sandbox/payment_token`
3. **Authorization format:** `Bearer <access_key>:<secret_key>`
4. **Request ID:** From error response (e.g., `sb_appreq_5e694b7D04757Ac`)
5. **Account email:** Your Zwitch account email
6. **Environment:** Sandbox

## Next Steps

1. **Redeploy Edge Function** with updated logging
2. **Check logs** for detailed credential info
3. **Test with curl** using exact credentials from Zwitch
4. **Compare** credentials in Zwitch vs Supabase Vault
5. **Contact Zwitch** if curl also fails

The issue is definitely with credentials or account setup. Once Zwitch confirms credentials are correct, integration will work!

