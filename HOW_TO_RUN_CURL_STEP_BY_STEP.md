# How to Run curl - Step by Step Guide

## What is curl?

`curl` is a command-line tool to make HTTP requests. We'll use it to test if your Zwitch credentials work directly with their API.

---

## Step 1: Check if curl is Installed

### On Mac:
1. Open **Terminal** (Applications → Utilities → Terminal)
2. Type: `curl --version`
3. Press Enter
4. If you see version info → curl is installed ✅
5. If you see "command not found" → Install curl (usually pre-installed on Mac)

### On Windows:
1. Open **Command Prompt** (Press `Windows + R`, type `cmd`, press Enter)
   OR
   Open **PowerShell** (Press `Windows + X`, select PowerShell)
2. Type: `curl --version`
3. Press Enter
4. If you see version info → curl is installed ✅
5. If you see error → curl comes with Windows 10/11, but might need to use `curl.exe`

### On Linux:
1. Open Terminal
2. Type: `curl --version`
3. Press Enter
4. If installed → You'll see version ✅
5. If not → Install: `sudo apt-get install curl` (Ubuntu/Debian) or `sudo yum install curl` (CentOS/RHEL)

---

## Step 2: Get Your Credentials from Supabase Vault

### Option A: From Supabase Dashboard
1. Go to Supabase Dashboard
2. Project Settings → Edge Functions → Secrets
3. Find `ZWITCH_ACCESS_KEY` - **Copy the value**
4. Find `ZWITCH_SECRET_KEY` - **Copy the value**
5. Keep them handy (you'll paste them in curl command)

### Option B: From Edge Function Logs
- Access Key: `ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa` (from your log)
- Secret Key: Get from Supabase Vault (it's hidden in logs for security)

---

## Step 3: Prepare the curl Command

### Full Command (You'll customize this):

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

### Replace:
- `YOUR_ACCESS_KEY` → Your actual access key from Vault
- `YOUR_SECRET_KEY` → Your actual secret key from Vault

---

## Step 4: Run curl Command

### On Mac/Linux:

**Method 1: Single Line (Easier)**
1. Open Terminal
2. Copy this command (replace YOUR_SECRET_KEY):
```bash
curl --request POST --url https://api.zwitch.io/v1/pg/payment_token --header 'Content-Type: application/json' --header "Authorization: Bearer ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa:YOUR_SECRET_KEY" --data '{"amount": 10, "currency": "INR", "contact_number": "7356697492", "email_id": "test@example.com", "mtx": "test1234"}'
```
3. Replace `YOUR_SECRET_KEY` with your actual secret key
4. Press Enter
5. Wait for response

**Method 2: Multi-Line (More Readable)**
1. Open Terminal
2. Type: `curl --request POST \`
3. Press Enter (you'll see `>` prompt)
4. Type: `--url https://api.zwitch.io/v1/pg/payment_token \`
5. Press Enter
6. Type: `--header 'Content-Type: application/json' \`
7. Press Enter
8. Type: `--header "Authorization: Bearer ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa:YOUR_SECRET_KEY" \`
9. Press Enter
10. Type: `--data '{"amount": 10, "currency": "INR", "contact_number": "7356697492", "email_id": "test@example.com", "mtx": "test1234"}'`
11. Press Enter
12. Wait for response

### On Windows:

**Method 1: Command Prompt**
1. Open Command Prompt
2. Copy this command (replace YOUR_SECRET_KEY):
```cmd
curl --request POST --url https://api.zwitch.io/v1/pg/payment_token --header "Content-Type: application/json" --header "Authorization: Bearer ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa:YOUR_SECRET_KEY" --data "{\"amount\": 10, \"currency\": \"INR\", \"contact_number\": \"7356697492\", \"email_id\": \"test@example.com\", \"mtx\": \"test1234\"}"
```
3. Replace `YOUR_SECRET_KEY` with your actual secret key
4. Press Enter
5. Wait for response

**Method 2: PowerShell**
1. Open PowerShell
2. Copy this command (replace YOUR_SECRET_KEY):
```powershell
curl.exe --request POST --url https://api.zwitch.io/v1/pg/payment_token --header "Content-Type: application/json" --header "Authorization: Bearer ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa:YOUR_SECRET_KEY" --data '{\"amount\": 10, \"currency\": \"INR\", \"contact_number\": \"7356697492\", \"email_id\": \"test@example.com\", \"mtx\": \"test1234\"}'
```
3. Replace `YOUR_SECRET_KEY` with your actual secret key
4. Press Enter
5. Wait for response

---

## Step 5: Understand the Response

### ✅ Success Response (200 OK):
```json
{
  "id": "payment_token_id_here",
  "status": "created",
  ...
}
```
**Meaning:** Credentials are correct! ✅

### ❌ Error Response (400 Bad Request):
```json
{
  "status_code": 400,
  "error": "Could not get merchant details",
  "request_id": "..."
}
```
**Meaning:** Credentials are wrong ❌

### ❌ Error Response (401 Unauthorized):
```json
{
  "status_code": 401,
  "error": "Unauthorized",
  ...
}
```
**Meaning:** Authorization header format is wrong ❌

---

## Step 6: Common Issues & Fixes

### Issue 1: "command not found"
**Fix:** curl is not installed
- Mac: Usually pre-installed, if not: `brew install curl`
- Windows: Use `curl.exe` instead of `curl`
- Linux: `sudo apt-get install curl`

### Issue 2: "syntax error" or "unexpected token"
**Fix:** Check quotes
- Use single quotes `'` for JSON data on Mac/Linux
- Use escaped double quotes `\"` on Windows
- Make sure all quotes match

### Issue 3: "Could not resolve host"
**Fix:** Check internet connection
- Make sure you're connected to internet
- Try: `ping api.zwitch.io` to test connectivity

### Issue 4: Response is empty or timeout
**Fix:** Check URL and headers
- Verify URL is correct: `https://api.zwitch.io/v1/pg/payment_token`
- Check authorization header format
- Make sure no extra spaces

---

## Alternative: Use Online Tool (Easier)

If curl is too complicated, use an online tool:

### Option 1: Postman (Recommended)
1. Download Postman: https://www.postman.com/downloads/
2. Open Postman
3. Create new request:
   - Method: **POST**
   - URL: `https://api.zwitch.io/v1/pg/payment_token`
4. Go to **Headers** tab:
   - Add: `Content-Type` = `application/json`
   - Add: `Authorization` = `Bearer ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa:YOUR_SECRET_KEY`
5. Go to **Body** tab:
   - Select **raw** and **JSON**
   - Paste:
   ```json
   {
     "amount": 10,
     "currency": "INR",
     "contact_number": "7356697492",
     "email_id": "test@example.com",
     "mtx": "test1234"
   }
   ```
6. Click **Send**
7. See response

### Option 2: Online curl Tool
1. Go to: https://reqbin.com/curl
2. Paste curl command
3. Click **Run**
4. See response

---

## Quick Copy-Paste Commands

### Mac/Linux (Single Line):
```bash
curl --request POST --url https://api.zwitch.io/v1/pg/payment_token --header 'Content-Type: application/json' --header "Authorization: Bearer ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa:YOUR_SECRET_KEY" --data '{"amount": 10, "currency": "INR", "contact_number": "7356697492", "email_id": "test@example.com", "mtx": "test1234"}'
```

### Windows Command Prompt:
```cmd
curl --request POST --url https://api.zwitch.io/v1/pg/payment_token --header "Content-Type: application/json" --header "Authorization: Bearer ak_live_C1t1TxfMFXM6c8WVFlR7sILGWXIQNa:YOUR_SECRET_KEY" --data "{\"amount\": 10, \"currency\": \"INR\", \"contact_number\": \"7356697492\", \"email_id\": \"test@example.com\", \"mtx\": \"test1234\"}"
```

**Remember:** Replace `YOUR_SECRET_KEY` with your actual secret key from Supabase Vault!

---

## What to Share

After running curl, please share:
1. **The command you ran** (with secret key masked)
2. **The response you got** (full response)
3. **Any error messages**

This will help identify if credentials are correct or wrong!

