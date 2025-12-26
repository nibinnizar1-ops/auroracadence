# Debug: Credentials Still Wrong

## Current Status

You're still getting: `"Could not get merchant details"` (400 Bad Request)

This means Zwitch API **cannot authenticate** your merchant account.

## Possible Causes

### 1. Credentials Still Wrong
- Access key or secret key don't match Zwitch records
- Credentials might be expired or revoked
- Wrong credentials copied (extra spaces, wrong characters)

### 2. Wrong Environment
- Using test credentials with live endpoint (or vice versa)
- Credentials are for sandbox but using production

### 3. Merchant Account Issue
- Merchant account not activated in Zwitch
- Account suspended or inactive
- Account not fully set up

### 4. Authorization Format Issue
- Even though format looks correct, Zwitch might expect different format
- Special characters in credentials causing issues

## Debugging Steps

### Step 1: Double-Check Credentials Format

**Verify in Supabase Vault:**
1. Go to Supabase Dashboard → Edge Functions → Secrets
2. Check `ZWITCH_ACCESS_KEY`:
   - Should start with `ak_live_` or `ak_test_`
   - Should be exactly 38 characters (or similar)
   - No extra spaces before/after
   - No line breaks

3. Check `ZWITCH_SECRET_KEY`:
   - Should start with `sk_live_` or `sk_test_`
   - Should be exactly 44 characters (or similar)
   - No extra spaces before/after
   - No line breaks

### Step 2: Verify Credentials in Zwitch Dashboard

**In Zwitch Dashboard:**
1. Go to API Settings / Credentials section
2. **Copy credentials directly** from Zwitch (don't type manually)
3. Compare with what's in Supabase Vault:
   - Access Key should match exactly
   - Secret Key should match exactly
   - Character by character comparison

### Step 3: Test with Exact Credentials

**Get fresh credentials from Zwitch:**
1. In Zwitch dashboard, **regenerate** API credentials (if possible)
2. Copy the new credentials
3. Update Supabase Vault with new credentials
4. Test with curl again

### Step 4: Check Environment Match

**Verify environment:**
- If credentials start with `ak_live_` → Use live/production endpoint
- If credentials start with `ak_test_` → Use sandbox/test endpoint

**Current endpoint:** `https://api.zwitch.io/v1/pg/payment_token`

**If using test credentials, try:**
```bash
curl --request POST \
     --url https://api.zwitch.io/v1/pg/sandbox/payment_token \
     --header 'Content-Type: application/json' \
     --header "Authorization: Bearer YOUR_ACCESS_KEY:YOUR_SECRET_KEY" \
     --data '{"amount": 10, "currency": "INR", "contact_number": "7356697492", "email_id": "test@example.com", "mtx": "test1234"}'
```

### Step 5: Contact Zwitch Support

**If credentials still don't work:**
1. Contact Zwitch support
2. Ask them to verify:
   - Your merchant account is active
   - API credentials are correct
   - Account has permission to create payment tokens
   - Any account setup issues

3. Request:
   - Fresh API credentials
   - Verification of account status
   - Confirmation of correct endpoint

## Alternative: Check Zwitch Documentation

**Verify:**
1. Check Zwitch API documentation
2. Look for:
   - Correct endpoint URL
   - Authorization header format
   - Required request parameters
   - Account setup requirements

## Quick Checklist

Before contacting Zwitch support, verify:

- [ ] Credentials copied exactly from Zwitch dashboard (no manual typing)
- [ ] No extra spaces before/after credentials in Vault
- [ ] Credentials match what's shown in Zwitch dashboard
- [ ] Merchant account is active in Zwitch
- [ ] Using correct environment (live vs test)
- [ ] Account has API access enabled
- [ ] Tried regenerating credentials in Zwitch

## What to Share with Zwitch Support

When contacting Zwitch support, share:

1. **Error message:** `"Could not get merchant details"` (400 Bad Request)
2. **Endpoint:** `https://api.zwitch.io/v1/pg/payment_token`
3. **Authorization format:** `Bearer ${accessKey}:${secretKey}`
4. **Request body:** Amount, currency, contact_number, email_id, mtx
5. **Request ID:** From error response (e.g., `appreq_3f694a9eB6c26fD`)

## Next Steps

1. **Double-check credentials** in Zwitch dashboard vs Supabase Vault
2. **Try regenerating credentials** in Zwitch (if possible)
3. **Test with sandbox endpoint** if using test credentials
4. **Contact Zwitch support** if still not working
5. **Verify merchant account** is fully activated

The issue is definitely with credentials or account setup. Once Zwitch confirms your credentials are correct, we can proceed!

