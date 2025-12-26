# How to Check Edge Function Logs - Step by Step

## Step 2: Check Edge Function Logs

### Method 1: Supabase Dashboard (Easiest)

#### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Log in with your account
3. Select your project

#### Step 2: Navigate to Edge Functions
1. In the left sidebar, click **"Edge Functions"**
2. You'll see a list of your Edge Functions

#### Step 3: Open create-payment-order Function
1. Find **"create-payment-order"** in the list
2. Click on it to open the function details

#### Step 4: Go to Logs Tab
1. You'll see tabs: **"Code"**, **"Logs"**, **"Settings"**, etc.
2. Click on **"Logs"** tab

#### Step 5: View Recent Logs
1. You'll see a list of recent function invocations
2. Each entry shows:
   - Timestamp (when it ran)
   - Status (Success/Error)
   - Duration
   - Request details

#### Step 6: Click on Latest Error Entry
1. Find the most recent error entry (usually shows in red or has error icon)
2. Click on it to expand and see details

#### Step 7: Look for Log Messages
Scroll through the logs and look for these specific log entries:

**Log Entry 1: "Reading Zwitch credentials from Vault:"**
```
Reading Zwitch credentials from Vault: {
  "hasAccessKey": true/false,
  "accessKeyLength": 50,
  "accessKeyPrefix": "ak_live_xxxxx",
  "hasSecretKey": true/false,
  "secretKeyLength": 50,
  "secretKeyPrefix": "sk_live_xxxxx",
  "allEnvKeys": ["ZWITCH_ACCESS_KEY", "ZWITCH_SECRET_KEY", ...]
}
```

**Log Entry 2: "Zwitch API Configuration:"**
```
Zwitch API Configuration: {
  "endpoint": "https://api.zwitch.io/v1/pg/payment_token",
  "amount": 10,
  "currency": "INR",
  "accessKeyPrefix": "ak_live_xxxxx...",
  "accessKeyStartsWith": "ak_live",
  "hasSecretKey": true,
  "secretKeyLength": 50
}
```

**Log Entry 3: "Zwitch API Request Details:"**
```
Zwitch API Request Details: {
  "endpoint": "https://api.zwitch.io/v1/pg/payment_token",
  "authorizationHeaderFormat": "Bearer ak_live_xxxxx...:sk_live_xxxxx...",
  "authorizationHeaderLength": 100,
  "authorizationHeaderFirstChars": "Bearer ak_live_xxxxx:sk_live",
  "accessKeyLength": 50,
  "secretKeyLength": 50,
  "accessKeyStartsWith": "ak_live",
  "accessKeyEndsWith": "xxxxx",
  "secretKeyStartsWith": "sk_live",
  "requestBodyKeys": ["amount", "currency", "contact_number", ...]
}
```

**Log Entry 4: "Zwitch payment token creation failed:"** (if error occurs)
```
Zwitch payment token creation failed: {
  "status": 400,
  "statusText": "Bad Request",
  "error": "Could not get merchant details",
  "requestUrl": "https://api.zwitch.io/v1/pg/payment_token",
  "authorizationHeader": "Bearer ak_live_xxxxx...:sk_live_xxxxx...",
  "accessKeyPrefix": "ak_live_xxxxx",
  "secretKeyLength": 50
}
```

---

### Method 2: Filter Logs by Time

#### Step 1: Filter Recent Logs
1. In the Logs tab, look for a time filter (usually shows "Last 1 hour", "Last 24 hours", etc.)
2. Select **"Last 1 hour"** or **"Last 24 hours"** to see recent logs

#### Step 2: Filter by Function
1. If you have multiple functions, make sure you're viewing logs for **"create-payment-order"**
2. Use the function dropdown if available

#### Step 3: Filter by Status
1. Look for a filter option (Success/Error/All)
2. Select **"Error"** to see only error logs

---

### Method 3: Search Logs

#### Step 1: Use Search Box
1. In the Logs tab, look for a search box
2. Type: `"Reading Zwitch credentials"` or `"Zwitch API"`
3. Press Enter

#### Step 2: Review Search Results
1. You'll see all log entries containing your search term
2. Click on each to see full details

---

## What to Look For

### ✅ Good Signs (Credentials Working):
- `"hasAccessKey": true`
- `"hasSecretKey": true`
- `"accessKeyLength": 50` (or similar, > 20)
- `"secretKeyLength": 50` (or similar, > 20)
- `"accessKeyPrefix": "ak_live_xxxxx"` (starts with `ak_live_` or `ak_test_`)
- `"authorizationHeaderFormat": "Bearer ak_live_xxxxx...:sk_live_xxxxx..."`

### ❌ Bad Signs (Credentials Not Working):
- `"hasAccessKey": false` → Credentials not in Vault
- `"hasSecretKey": false` → Credentials not in Vault
- `"accessKeyLength": 0` → Credentials not read
- `"secretKeyLength": 0` → Credentials not read
- `"accessKeyPrefix": "NOT FOUND"` → Credentials not found
- `"allEnvKeys"` doesn't include `"ZWITCH_ACCESS_KEY"` → Wrong secret name

---

## How to Copy Logs

### Step 1: Expand Log Entry
1. Click on the log entry to expand it
2. You'll see the full log message

### Step 2: Copy Log Content
1. Select the log text
2. Right-click → Copy
3. Or use keyboard shortcut: `Cmd+C` (Mac) or `Ctrl+C` (Windows)

### Step 3: Share Logs
1. Paste the logs in a text file or message
2. Share with me so I can help debug

---

## Screenshot Guide

### What to Screenshot:
1. **Log Entry:** The full log entry showing "Reading Zwitch credentials from Vault"
2. **Error Log:** The error log showing "Zwitch payment token creation failed"
3. **Request Details:** The "Zwitch API Request Details" log entry

### How to Screenshot:
1. **Mac:** `Cmd + Shift + 4`, then select the area
2. **Windows:** `Windows + Shift + S`, then select the area
3. **Or:** Use browser screenshot extension

---

## Quick Checklist

Before checking logs, make sure:
- ✅ Edge Function is deployed (with latest code)
- ✅ You've tried making a payment (to generate logs)
- ✅ You're looking at logs for **"create-payment-order"** function
- ✅ You're viewing logs from the last hour (when you tried payment)

---

## Example: What Good Logs Look Like

```
[2025-12-23 10:30:00] Reading Zwitch credentials from Vault: {
  "hasAccessKey": true,
  "accessKeyLength": 48,
  "accessKeyPrefix": "ak_live_C1t1TxfMFXM6c8WVFl",
  "hasSecretKey": true,
  "secretKeyLength": 48,
  "secretKeyPrefix": "sk_live_xxxxx",
  "allEnvKeys": ["ZWITCH_ACCESS_KEY", "ZWITCH_SECRET_KEY", "SUPABASE_URL", ...]
}

[2025-12-23 10:30:00] Zwitch API Configuration: {
  "endpoint": "https://api.zwitch.io/v1/pg/payment_token",
  "amount": 100,
  "currency": "INR",
  "accessKeyPrefix": "ak_live_C1t1TxfMFXM6c8WVFl...",
  "accessKeyStartsWith": "ak_live",
  "hasSecretKey": true,
  "secretKeyLength": 48
}

[2025-12-23 10:30:00] Zwitch API Request Details: {
  "endpoint": "https://api.zwitch.io/v1/pg/payment_token",
  "authorizationHeaderFormat": "Bearer ak_live_C1t1TxfMFXM6c8WVFl...:sk_live_xxxxx...",
  "authorizationHeaderLength": 98,
  "authorizationHeaderFirstChars": "Bearer ak_live_C1t1TxfMFXM6c8WVFl:sk_live",
  "accessKeyLength": 48,
  "secretKeyLength": 48,
  "accessKeyStartsWith": "ak_live",
  "requestBodyKeys": ["amount", "currency", "contact_number", "email_id", "mtx", "udf"]
}
```

---

## If You Can't Find Logs

### Troubleshooting:
1. **No logs showing?**
   - Make sure you've tried making a payment recently
   - Check if you're looking at the right function
   - Try refreshing the page

2. **Logs are old?**
   - Make sure you've deployed the latest Edge Function code
   - Try making a payment again to generate new logs

3. **Can't see log details?**
   - Click on the log entry to expand it
   - Scroll down to see full log message
   - Use browser zoom if text is too small

---

## Next Steps After Checking Logs

Once you have the logs:
1. **Check the values** using the checklist above
2. **Copy the logs** (especially "Reading Zwitch credentials" and error logs)
3. **Share with me** so I can help identify the issue

The logs will tell us exactly what's happening! 🔍

