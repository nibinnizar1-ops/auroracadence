# Critical: Debug "Could not get merchant details" Error

## The Error

**"Could not get merchant details"** from Zwitch API means:
- ❌ Zwitch cannot identify/authenticate your merchant account
- ❌ This is **almost always** a credentials issue

## Immediate Action Required

### Step 1: Check Edge Function Logs (CRITICAL!)

After redeploying, check logs for these entries:

**1. "Active gateway found:"**
```json
{
  "code": "zwitch",
  "hasCredentials": true
}
```

**2. "Gateway config created:"**
```json
{
  "credentialsKeys": ["access_key", "secret_key"],
  "hasAccessKey": true,
  "hasSecretKey": true,
  "accessKeyPrefix": "ak_live_xxxxx",
  "secretKeyLength": 50
}
```

**3. "Zwitch API Request Details:"**
```json
{
  "authorizationHeaderFormat": "Bearer ak_live_xxxxx...:sk_live_xxxxx...",
  "accessKeyLength": 50,
  "secretKeyLength": 50,
  "accessKeyStartsWith": "ak_live"
}
```

**4. "Zwitch payment token creation failed:"**
```json
{
  "error": "Could not get merchant details",
  "authorizationHeader": "Bearer ak_live_xxxxx...:sk_live_xxxxx...",
  "accessKeyPrefix": "ak_live_xxxxx",
  "secretKeyLength": 50
}
```

### Step 2: Verify Database Credentials

Run this SQL:
```sql
SELECT 
  code,
  is_active,
  credentials->>'access_key' as access_key,
  LEFT(credentials->>'access_key', 20) as access_key_prefix,
  LENGTH(credentials->>'access_key') as access_key_length,
  LEFT(credentials->>'secret_key', 20) as secret_key_prefix,
  LENGTH(credentials->>'secret_key') as secret_key_length,
  CASE 
    WHEN credentials->>'access_key' LIKE 'ak_live_%' THEN 'LIVE'
    WHEN credentials->>'access_key' LIKE 'ak_test_%' THEN 'TEST'
    ELSE 'UNKNOWN'
  END as key_type
FROM payment_gateways
WHERE code = 'zwitch' AND is_active = true;
```

**Expected Results:**
- ✅ `access_key` starts with `ak_live_` or `ak_test_`
- ✅ `access_key_length` > 20
- ✅ `secret_key_length` > 20
- ✅ `key_type` is LIVE or TEST

### Step 3: Test with curl (MOST IMPORTANT!)

**Get your credentials from database, then test:**

```bash
curl --request POST \
     --url https://api.zwitch.io/v1/pg/payment_token \
     --header 'Content-Type: application/json' \
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
- `YOUR_ACCESS_KEY` = Your actual access key from database
- `YOUR_SECRET_KEY` = Your actual secret key from database

**Results:**

**If curl works:**
- ✅ Credentials are correct
- ❌ Issue is in Edge Function code
- Check: How credentials are retrieved/sent

**If curl fails with same error:**
- ❌ Credentials are wrong
- ❌ Need to get correct keys from Zwitch dashboard
- ❌ Keys might be expired/revoked

## Most Common Issues

### Issue 1: Wrong Credentials
**Symptom:** curl also fails
**Fix:** Get correct credentials from Zwitch dashboard

### Issue 2: Credentials Not Retrieved
**Symptom:** Logs show `hasAccessKey: false` or `secretKeyLength: 0`
**Fix:** Check database, verify credentials are saved correctly

### Issue 3: Wrong Authorization Format
**Symptom:** Logs show wrong format
**Fix:** Should be `Bearer ${accessKey}:${secretKey}` (no spaces, colon between)

### Issue 4: Wrong Endpoint
**Symptom:** Using live keys but wrong endpoint
**Fix:** Verify endpoint matches key type

## What to Share

Please share:
1. **Edge Function logs** - All 4 log entries above
2. **Database query result** - SQL query result
3. **Curl test result** - Does curl work with your credentials?

This will identify the exact issue!

