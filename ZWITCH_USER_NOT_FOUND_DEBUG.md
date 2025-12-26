# Debugging "User not found" Error

## Error Message
```
"Invalid access key passed in header. User not found."
```

## What This Means

The error has two parts:
1. **"Invalid access key"** - But you've verified the access key is correct ✅
2. **"User not found"** - Zwitch cannot find a merchant account associated with this access key ❌

## Possible Causes

### 1. **Account Not Activated** (Most Likely)
- Zwitch merchant account exists but is not fully activated
- Account might be in "pending" or "inactive" status
- Need to complete account setup in Zwitch dashboard

### 2. **KYC/Verification Not Complete**
- Merchant account requires KYC (Know Your Customer) verification
- Business documents not uploaded/verified
- Account verification incomplete

### 3. **Sandbox Not Enabled**
- Sandbox environment not enabled for your account
- Need to enable sandbox/testing mode in Zwitch dashboard

### 4. **Account Suspended**
- Account might be suspended or restricted
- Payment processing disabled

### 5. **Access Key Mismatch**
- Access key doesn't belong to any active merchant account
- Key might be from a different account or environment

## How to Check Account Status

### Step 1: Log in to Zwitch Dashboard

1. Go to https://dashboard.zwitch.io (or your Zwitch dashboard URL)
2. Log in with your merchant account credentials

### Step 2: Check Account Status

Look for:
- **Account Status**: Should be "Active" or "Verified"
- **Account Type**: Should show "Merchant" or "Business"
- **Status Indicators**: Green checkmarks or "Active" badges

### Step 3: Check Sandbox/Test Mode

1. Look for **"Sandbox"** or **"Test Mode"** section
2. Check if sandbox is **enabled**
3. Verify you're using **sandbox credentials** (if testing)

### Step 4: Check KYC/Verification Status

1. Go to **Settings** → **Verification** or **KYC**
2. Check if all documents are uploaded
3. Check if verification is **complete**
4. Look for any pending actions

### Step 5: Check API Keys Section

1. Go to **Settings** → **API Keys** or **Developers** → **API Keys**
2. Verify:
   - Access key matches what's in Supabase Vault
   - Secret key matches what's in Supabase Vault
   - Keys are **active** (not disabled)
   - Keys are for **sandbox** (if testing)

## Test Script

I've created a test script (`test-zwitch-account.ts`) that you can run to test your credentials directly.

### Option 1: Run in Deno

```bash
deno run --allow-net test-zwitch-account.ts
```

### Option 2: Test with Curl

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

**If you get "User not found":**
- Account is not activated
- Contact Zwitch support

**If you get payment token:**
- Account is active
- Issue is elsewhere

## What to Check in Zwitch Dashboard

### Account Tab
- [ ] Account status is "Active"
- [ ] No warnings or restrictions
- [ ] Account type is "Merchant" or "Business"

### Settings → API Keys
- [ ] Access key matches Supabase Vault
- [ ] Secret key matches Supabase Vault
- [ ] Keys are active (not disabled)
- [ ] Using sandbox keys for testing

### Settings → Verification/KYC
- [ ] All documents uploaded
- [ ] Verification status is "Complete" or "Verified"
- [ ] No pending actions

### Sandbox/Test Mode
- [ ] Sandbox is enabled
- [ ] Test credentials are available
- [ ] Sandbox account is active

## Contact Zwitch Support

If account looks fine but still getting "User not found":

**Share with Zwitch Support:**
1. **Error message**: "Invalid access key passed in header. User not found."
2. **Endpoint**: `https://api.zwitch.io/v1/pg/sandbox/payment_token`
3. **Authorization format**: `Bearer <access_key>:<secret_key>`
4. **Request ID**: From error response (if available)
5. **Account email**: Your Zwitch account email
6. **Environment**: Sandbox
7. **Account status**: What you see in dashboard (Active/Inactive/etc.)

**Ask them:**
- Is my merchant account fully activated?
- Is sandbox enabled for my account?
- Are my API credentials valid and active?
- Is there any account restriction preventing API access?

## Next Steps

1. **Check Zwitch Dashboard** for account status
2. **Complete any pending verification** if needed
3. **Enable sandbox** if testing
4. **Contact Zwitch support** if account looks fine but still getting error
5. **Test with curl** to confirm credentials work

The "User not found" error is definitely an account-level issue, not a code issue. Once Zwitch confirms your account is active, the integration should work!

