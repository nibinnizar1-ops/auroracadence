# Check Edge Function Logs NOW

## The Error

**"Could not get merchant details"** - This means Zwitch cannot authenticate your merchant account.

## Critical: Check Logs

The enhanced logging I added should show **exactly** what's being sent. Please check Edge Function logs for:

### Log Entry 1: "Gateway config created:"

Look for this log entry. It should show:
```json
{
  "isTestMode": false,
  "credentialsKeys": ["access_key", "secret_key"],
  "hasAccessKey": true,
  "hasSecretKey": true,
  "accessKeyPrefix": "ak_live_xxxxx",
  "secretKeyLength": 50
}
```

**What to check:**
- ✅ `hasAccessKey: true`
- ✅ `hasSecretKey: true`
- ✅ `accessKeyPrefix` starts with `ak_live_` or `ak_test_`
- ✅ `secretKeyLength` > 20 (not 0)

### Log Entry 2: "Zwitch API Request Details:"

Look for this log entry. It should show:
```json
{
  "endpoint": "https://api.zwitch.io/v1/pg/payment_token",
  "authorizationHeaderFormat": "Bearer ak_live_xxxxx...:sk_live_xxxxx...",
  "authorizationHeaderLength": 100,
  "accessKeyLength": 50,
  "secretKeyLength": 50,
  "accessKeyStartsWith": "ak_live"
}
```

**What to check:**
- ✅ `authorizationHeaderFormat` shows correct format
- ✅ `accessKeyLength` > 20
- ✅ `secretKeyLength` > 20
- ✅ `accessKeyStartsWith` is `ak_live` or `ak_test`

### Log Entry 3: "Zwitch payment token creation failed:"

Look for this log entry. It should show:
```json
{
  "status": 400,
  "error": "Could not get merchant details",
  "authorizationHeader": "Bearer ak_live_xxxxx...:sk_live_xxxxx...",
  "accessKeyPrefix": "ak_live_xxxxx",
  "secretKeyLength": 50
}
```

## What to Share

Please share:
1. **All 3 log entries** from Edge Function logs
2. **Database credentials check** - Run this SQL:

```sql
SELECT 
  credentials->>'access_key' as access_key,
  LEFT(credentials->>'access_key', 20) as access_key_prefix,
  LENGTH(credentials->>'access_key') as access_key_length,
  LENGTH(credentials->>'secret_key') as secret_key_length
FROM payment_gateways
WHERE code = 'zwitch' AND is_active = true;
```

3. **Curl test result** - Test with your actual credentials:

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

## Most Likely Issue

Based on the error, the most likely issues are:

1. **Wrong credentials** - Access key or secret key don't match any merchant account
2. **Credentials format** - Keys might have extra spaces or wrong format
3. **Merchant account not activated** - Account might not be set up properly in Zwitch

## Quick Fixes to Try

### Fix 1: Verify Credentials in Admin Panel

1. Go to `/admin/payments/gateways`
2. Click "Configure" on Zwitch
3. **Copy** the Access Key and Secret Key
4. **Paste** them into a text editor
5. Check for:
   - No extra spaces at start/end
   - Correct format (access key starts with `ak_live_` or `ak_test_`)
   - Both keys are complete

### Fix 2: Re-enter Credentials

1. Delete the credentials in admin panel
2. Re-enter them carefully
3. Save
4. Try payment again

### Fix 3: Check Zwitch Dashboard

1. Log into Zwitch dashboard
2. Verify your merchant account is active
3. Verify your API credentials are correct
4. Check if credentials have expired

## Next Steps

1. **Check Edge Function logs** - Share the 3 log entries
2. **Run SQL query** - Share the results
3. **Test with curl** - Share if it works or fails

This will help identify the exact issue!

