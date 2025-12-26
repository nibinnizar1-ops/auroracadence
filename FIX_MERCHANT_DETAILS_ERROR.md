# Fix: "Could not get merchant details" Error

## Error Meaning

**"Could not get merchant details"** from Zwitch API means:
- The API cannot identify/authenticate the merchant
- Usually caused by **wrong credentials** or **wrong authorization format**

## Most Common Causes

### 1. Wrong Access Key or Secret Key
- Keys don't match
- Keys are for wrong environment (sandbox vs live)
- Keys are expired or revoked

### 2. Wrong Authorization Format
- Should be: `Bearer ${accessKey}:${secretKey}`
- Check: No extra spaces, correct format

### 3. Credentials Not Retrieved Correctly
- Database might have wrong values
- Edge Function might not be reading them correctly

## Debugging Steps

### Step 1: Check Edge Function Logs

After redeploying, check logs for:
```
"Zwitch API Configuration:"
```

**Look for:**
- `accessKeyPrefix`: Should start with `ak_live_` or `ak_test_`
- `hasSecretKey`: Should be `true`
- `secretKeyLength`: Should be > 0

### Step 2: Verify Credentials in Database

Run this SQL:
```sql
SELECT 
  code,
  credentials->>'access_key' as access_key,
  LEFT(credentials->>'secret_key', 30) as secret_key_prefix,
  LENGTH(credentials->>'secret_key') as secret_key_length,
  is_test_mode
FROM payment_gateways
WHERE code = 'zwitch' AND is_active = true;
```

**Check:**
- ✅ Access key exists and starts with `ak_live_` or `ak_test_`
- ✅ Secret key exists and has reasonable length (> 20 chars)
- ✅ Both are not null or empty

### Step 3: Test Authorization Format

The authorization should be exactly:
```
Bearer ak_live_xxxxx:sk_live_xxxxx
```

**Common mistakes:**
- ❌ `Bearer ${secretKey}` (missing access key)
- ❌ `Bearer ${accessKey}` (missing secret key)
- ❌ `Bearer ${accessKey} ${secretKey}` (space instead of colon)
- ❌ `Bearer: ${accessKey}:${secretKey}` (extra colon)

### Step 4: Verify Endpoint

**Current:** `https://api.zwitch.io/v1/pg/payment_token`

**If using sandbox credentials:** Should be `/pg/sandbox/payment_token`
**If using live credentials:** Should be `/pg/live/payment_token` or `/pg/payment_token`

**Check:** Does your access key start with:
- `ak_test_` → Use sandbox endpoint
- `ak_live_` → Use live endpoint (or `/pg/payment_token`)

## Quick Fixes

### Fix 1: Verify Credentials Are Correct

1. Go to admin panel: `/admin/payments/gateways`
2. Click "Configure" on Zwitch
3. Verify:
   - Access Key: Starts with `ak_live_` or `ak_test_`
   - Secret Key: Not empty, correct value
4. Save and try again

### Fix 2: Check Authorization Header

The code should be:
```typescript
"Authorization": `Bearer ${accessKey}:${secretKey}`
```

**Verify:**
- No extra spaces
- Colon between access key and secret key
- Both keys are not null/undefined

### Fix 3: Test with curl

Try the exact same request with curl:
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

**If curl works:**
- The credentials are correct
- Issue is in Edge Function code

**If curl fails:**
- Credentials are wrong
- Need to get correct keys from Zwitch

## Enhanced Logging Added

I've added detailed logging to help debug:

1. **Before request:**
   - Access key prefix
   - Secret key length
   - Endpoint URL

2. **Request body:**
   - Full request body
   - Authorization header (masked)

3. **On error:**
   - Full error response
   - Request details
   - Authorization header format

## Next Steps

1. **Redeploy Edge Function** with enhanced logging
2. **Try payment again**
3. **Check Edge Function logs** for detailed information
4. **Share the logs** so we can see exactly what's being sent

The enhanced logging will show us exactly what's wrong!

