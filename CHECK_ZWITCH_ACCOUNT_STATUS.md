# How to Check Zwitch Account Status

## The "User not found" Error

The error `"Invalid access key passed in header. User not found."` means:
- ✅ Access key format is correct
- ✅ Access key is being sent correctly
- ❌ **Zwitch cannot find a merchant account associated with this access key**

This is an **account-level issue**, not a code issue.

## Why SQL Won't Help

- This error comes from **Zwitch API**, not our database
- Our database doesn't store Zwitch merchant accounts
- We need to check **Zwitch Dashboard** or use **Zwitch API** to verify account

## How to Check Account Status

### Method 1: Test with Script (Recommended)

I've created a test script (`test-zwitch-credentials.sh`):

1. **Edit the script:**
   ```bash
   # Open test-zwitch-credentials.sh
   # Replace YOUR_ACCESS_KEY_HERE with your actual access key
   # Replace YOUR_SECRET_KEY_HERE with your actual secret key
   ```

2. **Make it executable:**
   ```bash
   chmod +x test-zwitch-credentials.sh
   ```

3. **Run it:**
   ```bash
   ./test-zwitch-credentials.sh
   ```

4. **Check results:**
   - ✅ If success: Account is active, credentials work
   - ❌ If "User not found": Account not activated or needs verification

### Method 2: Test with Curl

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
    "mtx": "test123"
  }'
```

**Results:**
- ✅ `{"id": "payment_token_id"}` = Account is active
- ❌ `"User not found"` = Account not activated

### Method 3: Check Zwitch Dashboard

1. **Log in to Zwitch Dashboard**
   - URL: https://dashboard.zwitch.io (or your Zwitch URL)

2. **Check Account Status:**
   - Look for account status indicator
   - Should show "Active" or "Verified"
   - If shows "Pending" or "Inactive" → Account not activated

3. **Check Sandbox/Test Mode:**
   - Go to Settings → Sandbox or Test Mode
   - Verify sandbox is **enabled**
   - If disabled → Enable it

4. **Check Verification/KYC:**
   - Go to Settings → Verification or KYC
   - Check if all documents uploaded
   - Check if verification is **complete**
   - If incomplete → Complete verification

5. **Check API Keys:**
   - Go to Settings → API Keys
   - Verify access key matches Supabase Vault
   - Verify secret key matches Supabase Vault
   - Check if keys are **active** (not disabled)

## Common Issues & Solutions

### Issue 1: Account Not Activated
**Symptom:** "User not found" error
**Solution:**
1. Log in to Zwitch Dashboard
2. Complete account setup
3. Wait for activation (may take time)
4. Contact Zwitch support if not activated after setup

### Issue 2: Sandbox Not Enabled
**Symptom:** "User not found" with sandbox credentials
**Solution:**
1. Go to Zwitch Dashboard → Settings → Sandbox
2. Enable sandbox/test mode
3. Generate new sandbox credentials if needed

### Issue 3: KYC/Verification Incomplete
**Symptom:** Account exists but API doesn't work
**Solution:**
1. Go to Zwitch Dashboard → Verification
2. Upload required documents
3. Complete verification process
4. Wait for approval

### Issue 4: Account Suspended
**Symptom:** Account was working but now "User not found"
**Solution:**
1. Check Zwitch Dashboard for warnings
2. Contact Zwitch support
3. Resolve any account issues

## What to Check in Zwitch Dashboard

### ✅ Account Tab
- [ ] Account status = "Active" or "Verified"
- [ ] No warnings or restrictions
- [ ] Account type = "Merchant" or "Business"

### ✅ Settings → API Keys
- [ ] Access key matches Supabase Vault
- [ ] Secret key matches Supabase Vault
- [ ] Keys are active (not disabled)
- [ ] Using sandbox keys for testing

### ✅ Settings → Sandbox/Test Mode
- [ ] Sandbox is enabled
- [ ] Test credentials available
- [ ] Sandbox account is active

### ✅ Settings → Verification/KYC
- [ ] All documents uploaded
- [ ] Verification status = "Complete"
- [ ] No pending actions

## Contact Zwitch Support

If account looks fine but still getting "User not found":

**Share with Zwitch:**
1. Error: "Invalid access key passed in header. User not found."
2. Endpoint: `https://api.zwitch.io/v1/pg/sandbox/payment_token`
3. Authorization: `Bearer <access_key>:<secret_key>`
4. Account email: Your Zwitch account email
5. Environment: Sandbox
6. Account status: What you see in dashboard

**Ask them:**
- Is my merchant account fully activated?
- Is sandbox enabled for my account?
- Are my API credentials valid?
- Is there any restriction preventing API access?

## Next Steps

1. **Run test script** (`test-zwitch-credentials.sh`)
2. **Check Zwitch Dashboard** for account status
3. **Complete verification** if needed
4. **Enable sandbox** if testing
5. **Contact Zwitch support** if still not working

The "User not found" error is definitely an account-level issue. Once Zwitch confirms your account is active, the integration will work!

