# Zwitch Sandbox "User not found" - Account Perfect

## Current Situation

✅ **Account is perfect in Zwitch Dashboard**
✅ **Sandbox doesn't need KYC**
✅ **Credentials format is correct** (`ak_test_...`, `sk_test_...`)
✅ **Endpoint is correct** (`/pg/sandbox/payment_token`)
✅ **Authorization format is correct** (`Bearer access_key:secret_key`)
❌ **Still getting "User not found"**

## Possible Causes

### 1. **Sandbox API Access Not Enabled**
Even though sandbox exists, API access might need to be explicitly enabled:
- Check Zwitch Dashboard → Settings → API Access
- Look for "Enable Sandbox API" or "Enable Test API" toggle
- May need to enable API access separately from sandbox account

### 2. **Merchant Account Not Linked to API Keys**
- API keys exist but not linked to merchant account
- Need to link keys to merchant account in dashboard
- Check Settings → API Keys → Link to Merchant Account

### 3. **Sub-Account Required**
- Some Zwitch accounts require `sub_accounts_id` parameter
- Check if your account uses sub-accounts
- May need to include `sub_accounts_id` in request body

### 4. **Account Needs API Activation**
- Account exists but API access not activated
- May need to request API access from Zwitch
- Check for "Request API Access" or "Activate API" button

### 5. **Wrong Environment Mapping**
- Sandbox credentials might be mapped to wrong environment
- Check if credentials are actually for sandbox or live
- Verify in Zwitch Dashboard which environment keys belong to

## What to Check in Zwitch Dashboard

### Step 1: API Access Settings
1. Go to **Settings** → **API Access** or **Developers** → **API Settings**
2. Look for:
   - "Enable Sandbox API" toggle
   - "API Access Status" (should be "Active")
   - "Sandbox API Enabled" checkbox
3. Enable if disabled

### Step 2: API Keys Section
1. Go to **Settings** → **API Keys**
2. Check:
   - Are keys marked as "Active"?
   - Are keys linked to merchant account?
   - Is there a "Link to Account" button?
   - Do keys show "Sandbox" or "Test" label?

### Step 3: Merchant Account Settings
1. Go to **Account** → **Settings** or **Merchant Settings**
2. Check:
   - "API Access Enabled" toggle
   - "Sandbox Mode" enabled
   - "Test API Access" enabled
   - Any API-related restrictions

### Step 4: Sub-Accounts (If Applicable)
1. Check if your account uses sub-accounts
2. If yes, get the `sub_accounts_id`
3. We may need to include it in API requests

## Try This: Include Sub-Account ID

If your Zwitch account uses sub-accounts, we might need to include `sub_accounts_id`:

```bash
curl --request POST \
  --url https://api.zwitch.io/v1/pg/sandbox/payment_token \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --header "Authorization: Bearer YOUR_ACCESS_KEY:YOUR_SECRET_KEY" \
  --data '{
    "amount": 1,
    "currency": "INR",
    "contact_number": "9999999999",
    "email_id": "test@example.com",
    "mtx": "test123",
    "sub_accounts_id": "YOUR_SUB_ACCOUNT_ID"
  }'
```

## Contact Zwitch Support

Since account looks perfect but API doesn't work, contact Zwitch support with:

**Subject:** "Sandbox API - User not found error despite account being active"

**Details:**
1. Error: "Invalid access key passed in header. User not found."
2. Endpoint: `https://api.zwitch.io/v1/pg/sandbox/payment_token`
3. Access Key: `ak_test_jgAZSHMgJq91eAEvmLOi2k8ivfDSaltHtX76`
4. Request ID: `sb_appreq_A7694B806BDec35`
5. Account Status: Active in dashboard
6. Sandbox: Enabled
7. Question: "Is API access enabled for my sandbox account? Do I need to activate API access separately?"

## Quick Checklist

- [ ] Checked API Access settings in dashboard
- [ ] Verified API keys are active and linked
- [ ] Checked if sub-accounts are used
- [ ] Tried including `sub_accounts_id` if applicable
- [ ] Contacted Zwitch support

The issue is likely that API access needs to be enabled separately from the account itself, even in sandbox mode.

