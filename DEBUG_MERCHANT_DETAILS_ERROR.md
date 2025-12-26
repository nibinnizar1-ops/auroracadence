# Debug: "Could not get merchant details" Error

## Error Analysis

**Error:** `"Could not get merchant details"` (400 Bad Request)

This error from Zwitch API typically means:
1. **Authorization header is incorrect** - Access key/Secret key format wrong
2. **Invalid credentials** - Access key or Secret key is wrong
3. **Merchant not found** - The access key doesn't match any merchant account
4. **Missing required field** - Some field that identifies the merchant is missing

## What We're Sending

**Endpoint:** `https://api.zwitch.io/v1/pg/payment_token`

**Headers:**
```
Authorization: Bearer ${accessKey}:${secretKey}
Content-Type: application/json
```

**Body:**
```json
{
  "amount": 10,
  "currency": "INR",
  "contact_number": "7356697492",
  "email_id": "john.doe@bankopen.co",
  "mtx": "MTX_xxxxx",
  "udf": { ... },
  "sub_accounts_id": "sa_xxxxx"  // Optional, only if provided
}
```

## What Zwitch Expects (from your curl)

**Endpoint:** `https://api.zwitch.io/v1/pg/sandbox/payment_token` (or `/pg/live/payment_token`)

**Headers:**
```
Authorization: Bearer ${accessKey}:${secretKey}
Content-Type: application/json
```

**Body:**
```json
{
  "sub_accounts_id": "sa_da4f9f84ac6d",
  "mtx": "test1234",
  "currency": "INR",
  "email_id": "john.doe@bankopen.co",
  "contact_number": "7356697492",
  "amount": 10
}
```

## Possible Issues

### 1. Authorization Format
- ✅ We're using: `Bearer ${accessKey}:${secretKey}` (correct)
- Check: Are the keys correct in database?

### 2. Endpoint
- ⚠️ We're using: `/pg/payment_token` (no sandbox/live)
- Your curl shows: `/pg/sandbox/payment_token`
- **Question:** Does production use `/pg/payment_token` or `/pg/live/payment_token`?

### 3. Credentials
- Check: Are access key and secret key correct?
- Check: Are they for the right environment (sandbox vs live)?

### 4. Merchant Account
- The access key might not be associated with a valid merchant account
- The merchant account might not be activated

## Debugging Steps

### Step 1: Check Edge Function Logs

Look for the log entry: `"Zwitch API Configuration:"`

Check:
- `endpoint`: What URL is being called?
- `accessKeyPrefix`: Does it start with `ak_live_` or `ak_test_`?
- `amount`: Is it correct?

### Step 2: Verify Credentials in Database

Run this SQL:
```sql
SELECT 
  code,
  credentials->>'access_key' as access_key,
  LEFT(credentials->>'secret_key', 20) as secret_key_prefix,
  is_test_mode
FROM payment_gateways
WHERE code = 'zwitch' AND is_active = true;
```

**Check:**
- Access key starts with `ak_live_` or `ak_test_`?
- Secret key exists?
- `is_test_mode` matches your credentials?

### Step 3: Test with curl

Try the exact same request with curl:
```bash
curl --request POST \
     --url https://api.zwitch.io/v1/pg/payment_token \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --header "Authorization: Bearer YOUR_ACCESS_KEY:YOUR_SECRET_KEY" \
     --data '{
       "amount": 10,
       "currency": "INR",
       "contact_number": "7356697492",
       "email_id": "test@example.com",
       "mtx": "test1234"
     }'
```

**If curl works but Edge Function doesn't:**
- Compare the exact request body
- Check if there's a difference in headers

**If curl also fails:**
- Credentials are wrong
- Merchant account issue

### Step 4: Check Request Body Order

Zwitch might be sensitive to field order. Your curl shows:
1. `sub_accounts_id` (first)
2. `mtx`
3. `currency`
4. `email_id`
5. `contact_number`
6. `amount` (last)

Our code sends:
1. `amount` (first)
2. `currency`
3. `contact_number`
4. `email_id`
5. `mtx`
6. `udf`
7. `sub_accounts_id` (last, if provided)

**Try:** Reorder fields to match curl example

## Quick Fixes to Try

### Fix 1: Verify Endpoint
If you're using production credentials, try:
- `/pg/live/payment_token` instead of `/pg/payment_token`

### Fix 2: Check Credentials
- Verify access key and secret key are correct
- Verify they match the environment (sandbox vs live)

### Fix 3: Reorder Request Body
Match the exact order from curl example

### Fix 4: Add More Logging
Log the exact request being sent to Zwitch

## What to Share

Please share:
1. **Edge Function logs** - The "Zwitch API Configuration" log entry
2. **Database credentials** - First 20 chars of access key (to verify format)
3. **Curl test result** - Does the same request work with curl?

This will help identify the exact issue!

