# Check Request Details Log

## ✅ Good News: Credentials Are Being Read!

Your log shows credentials are being read from Vault correctly:
- ✅ Access Key: `ak_live_C1t1TxfMFXM6...` (38 chars)
- ✅ Secret Key: `sk_live_M1...` (44 chars)
- ✅ Both exist in Vault

## Next: Check Request Details

Since credentials are being read correctly, the issue might be:
1. **Authorization header format** - How it's being sent
2. **Request body** - What data is being sent
3. **Credentials themselves** - Wrong values in Vault

## What to Look For

In the **same error log entry**, scroll down and look for:

**Log Entry: "Zwitch API Request Details:"**

It should show:
```json
Zwitch API Request Details: {
  "endpoint": "https://api.zwitch.io/v1/pg/payment_token",
  "authorizationHeaderFormat": "Bearer ak_live_C1t1TxfMFXM6...:sk_live_M1...",
  "authorizationHeaderLength": number,
  "authorizationHeaderFirstChars": "Bearer ak_live_C1t1TxfMFXM6:sk_live",
  "accessKeyLength": 38,
  "secretKeyLength": 44,
  "accessKeyStartsWith": "ak_live",
  "accessKeyEndsWith": "...",
  "secretKeyStartsWith": "sk_live",
  "requestBodyKeys": ["amount", "currency", "contact_number", ...]
}
```

## What to Check

### 1. Authorization Header Format
- ✅ Should be: `Bearer ak_live_xxxxx:sk_live_xxxxx`
- ✅ No extra spaces
- ✅ Colon between keys (not space)
- ✅ Both keys present

### 2. Request Body
- ✅ Should include: `amount`, `currency`, `contact_number`, `email_id`, `mtx`
- ✅ Check if all required fields are present

### 3. Credentials Verification
Since credentials are being read, but Zwitch says "Could not get merchant details", it might mean:
- ❌ Credentials are wrong (don't match any merchant account)
- ❌ Credentials are for wrong environment
- ❌ Merchant account not activated in Zwitch

## Action Items

1. **Find "Zwitch API Request Details" log entry**
   - In the same error log, scroll down
   - Look for this exact text

2. **Copy and share that log entry**
   - So I can see the exact authorization header format
   - And verify the request body

3. **Test with curl** (if possible)
   - Use the exact credentials from Vault
   - Test if they work with Zwitch API directly

## Quick Test

If you can, test with curl using your actual credentials:

```bash
curl --request POST \
     --url https://api.zwitch.io/v1/pg/payment_token \
     --header 'Content-Type: application/json' \
     --header "Authorization: Bearer ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa:YOUR_SECRET_KEY" \
     --data '{
       "amount": 10,
       "currency": "INR",
       "contact_number": "7356697492",
       "email_id": "test@example.com",
       "mtx": "test1234"
     }'
```

Replace `YOUR_SECRET_KEY` with your actual secret key from Vault.

**If curl works:** Issue is in Edge Function code
**If curl fails:** Credentials are wrong, need correct keys from Zwitch

## Next Steps

1. Find and share "Zwitch API Request Details" log entry
2. Test with curl (if possible)
3. Verify credentials in Zwitch dashboard

The request details log will show us exactly what's being sent to Zwitch!

