# Debug: Vault Credentials Issue

## Error Still Occurring

**Error:** `"Could not get merchant details"` (400 Bad Request)

This means Zwitch API still cannot authenticate. Even though we moved credentials to Vault, the error persists.

## Possible Causes

### 1. Credentials Not Read from Vault
- Edge Function might not be reading environment variables correctly
- Secrets might not be set in Vault
- Secrets might have wrong names

### 2. Wrong Credentials in Vault
- Access key or secret key might be incorrect
- Keys might have extra spaces
- Keys might be for wrong environment

### 3. Authorization Header Issue
- Format might still be wrong
- Keys might not be concatenated correctly

## Debugging Steps

### Step 1: Check Edge Function Logs

After redeploying with enhanced logging, check for:

**Log Entry: "Reading Zwitch credentials from Vault:"**
```json
{
  "hasAccessKey": true,
  "accessKeyLength": 50,
  "accessKeyPrefix": "ak_live_xxxxx",
  "hasSecretKey": true,
  "secretKeyLength": 50,
  "allEnvKeys": ["ZWITCH_ACCESS_KEY", "ZWITCH_SECRET_KEY", ...]
}
```

**What to check:**
- ✅ `hasAccessKey: true`
- ✅ `hasSecretKey: true`
- ✅ `accessKeyLength` > 20
- ✅ `secretKeyLength` > 20
- ✅ `accessKeyPrefix` starts with `ak_live_` or `ak_test_`
- ✅ `allEnvKeys` includes `ZWITCH_ACCESS_KEY` and `ZWITCH_SECRET_KEY`

**If any are false/missing:**
- Credentials not set in Vault
- Wrong secret names
- Edge Function not reading from Vault

### Step 2: Verify Vault Secrets

**In Supabase Dashboard:**
1. Go to Project Settings → Edge Functions → Secrets
2. Check:
   - ✅ `ZWITCH_ACCESS_KEY` exists
   - ✅ `ZWITCH_SECRET_KEY` exists
   - ✅ Values are correct (no extra spaces)
   - ✅ Access key starts with `ak_live_` or `ak_test_`

### Step 3: Check Authorization Header

**Log Entry: "Zwitch API Request Details:"**
```json
{
  "authorizationHeaderFormat": "Bearer ak_live_xxxxx...:sk_live_xxxxx...",
  "authorizationHeaderLength": 100,
  "authorizationHeaderFirstChars": "Bearer ak_live_xxxxx:sk_live",
  "accessKeyStartsWith": "ak_live",
  "secretKeyStartsWith": "sk_live"
}
```

**What to check:**
- ✅ Format: `Bearer ${accessKey}:${secretKey}`
- ✅ No extra spaces
- ✅ Colon between keys (not space)
- ✅ Both keys present

### Step 4: Test with curl

**Get credentials from Vault, then test:**

```bash
curl --request POST \
     --url https://api.zwitch.io/v1/pg/payment_token \
     --header 'Content-Type: application/json' \
     --header "Authorization: Bearer YOUR_ACCESS_KEY_FROM_VAULT:YOUR_SECRET_KEY_FROM_VAULT" \
     --data '{
       "amount": 10,
       "currency": "INR",
       "contact_number": "7356697492",
       "email_id": "test@example.com",
       "mtx": "test1234"
     }'
```

**If curl works:**
- ✅ Credentials are correct
- ❌ Issue is in Edge Function code

**If curl fails:**
- ❌ Credentials are wrong
- Need to get correct keys from Zwitch

## Common Issues

### Issue 1: Secrets Not Set in Vault

**Symptom:** Logs show `hasAccessKey: false` or `hasSecretKey: false`

**Fix:**
1. Go to Supabase Dashboard → Edge Functions → Secrets
2. Add secrets:
   - Name: `ZWITCH_ACCESS_KEY` (exact name, case-sensitive)
   - Value: Your access key
   - Name: `ZWITCH_SECRET_KEY` (exact name, case-sensitive)
   - Value: Your secret key
3. Redeploy Edge Function

### Issue 2: Wrong Secret Names

**Symptom:** Logs show `allEnvKeys` doesn't include `ZWITCH_ACCESS_KEY`

**Fix:**
- Secret names must be **exactly**: `ZWITCH_ACCESS_KEY` and `ZWITCH_SECRET_KEY`
- Case-sensitive
- No extra spaces

### Issue 3: Credentials Wrong

**Symptom:** curl also fails with same error

**Fix:**
- Get correct credentials from Zwitch dashboard
- Verify they're for the right environment (live vs test)
- Update Vault secrets

## Enhanced Logging Added

I've added detailed logging to show:
1. **Vault Read:** Whether credentials are read from Vault
2. **Credential Details:** Length, prefix, format
3. **Authorization Header:** Exact format being sent
4. **Request Details:** Full request information

## Next Steps

1. **Redeploy Edge Function** with enhanced logging
2. **Check Edge Function logs** for the new log entries
3. **Share logs** so we can see exactly what's happening
4. **Test with curl** using credentials from Vault

The enhanced logging will show us exactly what's being sent to Zwitch!

