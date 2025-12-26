# Debug: "Could not get merchant details" - Credentials Issue

## Error Analysis

**Error:** `"Could not get merchant details"` (400 Bad Request)

This error means Zwitch API **cannot identify/authenticate the merchant**. This is **almost always** a credentials issue.

## Most Likely Causes

### 1. Wrong Access Key or Secret Key
- Keys don't match any merchant account
- Keys are for wrong environment
- Keys are expired/revoked

### 2. Authorization Header Format Issue
- Should be: `Bearer ${accessKey}:${secretKey}`
- Check for extra spaces, wrong format

### 3. Credentials Not Retrieved from Database
- Edge Function might not be reading credentials correctly
- Database might have wrong values

## Debugging Steps

### Step 1: Check Edge Function Logs

After redeploying with enhanced logging, check for:

**Log 1: "Zwitch API Configuration:"**
```json
{
  "endpoint": "https://api.zwitch.io/v1/pg/payment_token",
  "accessKeyPrefix": "ak_live_xxxxx...",
  "hasSecretKey": true,
  "secretKeyLength": 50
}
```

**Log 2: "Zwitch payment token creation failed:"**
```json
{
  "error": "...",
  "authorizationHeader": "Bearer ak_live_xxxxx...:sk_live_xxxxx...",
  "accessKeyPrefix": "ak_live_xxxxx",
  "secretKeyLength": 50
}
```

**What to check:**
- ✅ `accessKeyPrefix` starts with `ak_live_` or `ak_test_`
- ✅ `hasSecretKey` is `true`
- ✅ `secretKeyLength` is > 20 (not 0 or very small)
- ✅ `authorizationHeader` format is correct

### Step 2: Verify Database Credentials

Run this SQL:
```sql
SELECT 
  code,
  is_active,
  credentials->>'access_key' as access_key,
  LEFT(credentials->>'secret_key', 30) as secret_key_prefix,
  LENGTH(credentials->>'secret_key') as secret_key_length,
  CASE 
    WHEN credentials->>'access_key' IS NULL THEN '❌ Missing'
    WHEN credentials->>'access_key' = '' THEN '❌ Empty'
    WHEN credentials->>'access_key' LIKE 'ak_live_%' THEN '✅ Live Key'
    WHEN credentials->>'access_key' LIKE 'ak_test_%' THEN '✅ Test Key'
    ELSE '⚠️ Unknown Format'
  END as access_key_status,
  CASE 
    WHEN credentials->>'secret_key' IS NULL THEN '❌ Missing'
    WHEN credentials->>'secret_key' = '' THEN '❌ Empty'
    WHEN LENGTH(credentials->>'secret_key') < 20 THEN '⚠️ Too Short'
    ELSE '✅ OK'
  END as secret_key_status
FROM payment_gateways
WHERE code = 'zwitch' AND is_active = true;
```

**Expected:**
- `access_key_status`: ✅ Live Key or ✅ Test Key
- `secret_key_status`: ✅ OK
- `secret_key_length`: > 20

### Step 3: Test Authorization Format

The authorization header should be **exactly**:
```
Bearer ak_live_xxxxx:sk_live_xxxxx
```

**Common mistakes:**
- ❌ `Bearer ${secretKey}` (missing access key)
- ❌ `Bearer ${accessKey}` (missing secret key)
- ❌ `Bearer ${accessKey} ${secretKey}` (space instead of colon)
- ❌ `Bearer: ${accessKey}:${secretKey}` (extra colon)
- ❌ `Basic ${accessKey}:${secretKey}` (wrong auth type)

### Step 4: Test with curl

Try the exact same request with curl using your actual credentials:

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
- `YOUR_ACCESS_KEY` with your actual access key from database
- `YOUR_SECRET_KEY` with your actual secret key from database

**If curl works:**
- ✅ Credentials are correct
- ❌ Issue is in Edge Function code (how we're reading/sending)

**If curl fails with same error:**
- ❌ Credentials are wrong
- Need to get correct keys from Zwitch dashboard

## Common Issues & Fixes

### Issue 1: Credentials Not in Database

**Fix:**
1. Go to admin panel: `/admin/payments/gateways`
2. Click "Configure" on Zwitch
3. Enter correct Access Key and Secret Key
4. Save

### Issue 2: Wrong Authorization Format

**Current code:**
```typescript
"Authorization": `Bearer ${accessKey}:${secretKey}`
```

**Verify:**
- No extra spaces
- Colon between keys (not space)
- Both keys are strings (not null/undefined)

### Issue 3: Credentials Retrieved Incorrectly

**Check Edge Function code:**
```typescript
const accessKey = config.credentials.access_key;
const secretKey = config.credentials.secret_key;
```

**Verify:**
- `config.credentials` exists
- `access_key` and `secret_key` are in credentials object
- Values are not null/undefined

## What to Share

Please share:
1. **Edge Function logs** - The "Zwitch API Configuration" and error logs
2. **Database query result** - Run the SQL above and share results
3. **Curl test result** - Does curl work with your credentials?

This will help identify the exact issue!

