# Zwitch API Error: "Invalid access key passed in header. User not found."

## Problem Analysis

Based on the logs, the Edge Function is:
✅ Successfully reading credentials from Supabase Vault
✅ Correctly detecting sandbox environment (`ak_test_` prefix)
✅ Using correct sandbox endpoint (`https://api.zwitch.io/v1/pg/sandbox/payment_token`)
✅ Sending authorization header in correct format: `Bearer ak_test_...:sk_test_...`

**But Zwitch API returns:** `400 Bad Request - "Invalid access key passed in header. User not found."`

## Possible Causes

### 1. **Invalid Credentials** (Most Likely)
The credentials in Supabase Vault might be:
- Wrong/incorrect values
- Expired credentials
- Credentials from wrong Zwitch account
- Credentials copied incorrectly (extra spaces, wrong characters)

### 2. **Zwitch Account Not Activated**
- Merchant account might not be fully activated in Zwitch
- Sandbox account might not be enabled
- Account might be suspended or inactive

### 3. **Credential Mismatch**
- Access key and secret key might not belong to the same account
- Mixing sandbox and live credentials

## Solution Steps

### Step 1: Verify Credentials in Zwitch Dashboard

1. **Log in to Zwitch Dashboard**
   - Go to https://dashboard.zwitch.io (or your Zwitch dashboard URL)
   - Log in with your merchant account

2. **Check API Credentials**
   - Navigate to **Settings** → **API Keys** or **Developers** → **API Keys**
   - Find your **Sandbox** credentials
   - Verify:
     - Access Key starts with `ak_test_`
     - Secret Key starts with `sk_test_`
     - Both are active/enabled

3. **Copy Credentials Fresh**
   - **Don't type manually** - use copy/paste
   - Copy access key exactly as shown
   - Copy secret key exactly as shown
   - Make sure no extra spaces or characters

### Step 2: Update Supabase Vault

1. **Go to Supabase Dashboard**
   - Project Settings → Edge Functions → Secrets

2. **Update ZWITCH_ACCESS_KEY**
   - Click on `ZWITCH_ACCESS_KEY`
   - Delete old value
   - Paste fresh access key from Zwitch dashboard
   - Save

3. **Update ZWITCH_SECRET_KEY**
   - Click on `ZWITCH_SECRET_KEY`
   - Delete old value
   - Paste fresh secret key from Zwitch dashboard
   - Save

4. **Verify No Extra Spaces**
   - Make sure there are no leading/trailing spaces
   - Make sure there are no line breaks
   - Values should be single-line strings

### Step 3: Test Credentials with Curl

Test if credentials work directly with Zwitch API:

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
- `YOUR_ACCESS_KEY` with your actual access key
- `YOUR_SECRET_KEY` with your actual secret key

**Expected Response:**
- ✅ Success: `{"id": "payment_token_id"}`
- ❌ Error: If you get "Invalid access key", the credentials are wrong

### Step 4: Redeploy Edge Function

After updating credentials in Vault:

1. **Redeploy Edge Function**
   - Edge Functions → `create-payment-order` → Deploy
   - OR use CLI: `supabase functions deploy create-payment-order`

2. **Test Payment Flow Again**

### Step 5: Check Zwitch Account Status

If credentials still don't work:

1. **Check Account Status**
   - Log in to Zwitch Dashboard
   - Check if account is active
   - Check if sandbox is enabled
   - Look for any warnings or restrictions

2. **Contact Zwitch Support**
   - If account looks fine but credentials don't work
   - Share error: "Invalid access key passed in header. User not found."
   - Ask them to verify your sandbox credentials are correct

## What to Check

- [ ] Credentials copied exactly from Zwitch dashboard (no manual typing)
- [ ] Access key starts with `ak_test_` (for sandbox)
- [ ] Secret key starts with `sk_test_` (for sandbox)
- [ ] No extra spaces in credentials
- [ ] Credentials match what's shown in Zwitch dashboard
- [ ] Zwitch account is active
- [ ] Sandbox is enabled in Zwitch account
- [ ] Tested credentials with curl command
- [ ] Redeployed Edge Function after updating credentials

## Next Steps

1. **First:** Verify and update credentials in Supabase Vault
2. **Second:** Test with curl to confirm credentials work
3. **Third:** Redeploy Edge Function
4. **Fourth:** Test payment flow
5. **If still fails:** Contact Zwitch support with curl test results

The issue is definitely with the credentials themselves or the Zwitch account setup. Once Zwitch confirms your credentials are correct, the integration should work!

