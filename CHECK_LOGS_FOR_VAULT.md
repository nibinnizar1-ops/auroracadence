# Check Logs for Vault Credentials

## What to Look For

Based on the error you're seeing, I need to check if the Edge Function is reading credentials from Vault.

### Critical Log Entry to Find

**Look for this log entry:** `"Reading Zwitch credentials from Vault"`

If this log entry is **MISSING**, it means:
- ❌ Edge Function wasn't redeployed with new code
- ❌ Need to redeploy Edge Function

If this log entry **EXISTS**, check its values:
- ✅ `hasAccessKey: true` → Credentials are being read
- ✅ `hasSecretKey: true` → Credentials are being read
- ✅ `accessKeyLength: > 20` → Credential has value
- ✅ `secretKeyLength: > 20` → Credential has value

## Steps to Check

### Step 1: Find the Log Entry

1. In Supabase Dashboard → Edge Functions → create-payment-order → Logs
2. Click on the latest error entry (the one you showed me)
3. Scroll through the logs
4. Look for: **"Reading Zwitch credentials from Vault"**

### Step 2: If Log Entry is Missing

**This means Edge Function needs to be redeployed:**

1. Go to Supabase Dashboard → Edge Functions → create-payment-order
2. Click **"Code"** tab
3. Copy entire `supabase/functions/create-payment-order/index.ts` file
4. Paste into the code editor
5. Click **"Deploy"** or **"Save"**
6. Wait for deployment to complete
7. Try payment again
8. Check logs again - should now see "Reading Zwitch credentials from Vault"

### Step 3: If Log Entry Exists

**Check the values:**

Look for this in the log:
```json
{
  "hasAccessKey": true/false,
  "accessKeyLength": number,
  "accessKeyPrefix": "ak_live_xxxxx",
  "hasSecretKey": true/false,
  "secretKeyLength": number,
  "allEnvKeys": ["ZWITCH_ACCESS_KEY", "ZWITCH_SECRET_KEY", ...]
}
```

**What to check:**
- If `hasAccessKey: false` → `ZWITCH_ACCESS_KEY` not in Vault
- If `hasSecretKey: false` → `ZWITCH_SECRET_KEY` not in Vault
- If `accessKeyLength: 0` → Credential is empty in Vault
- If `allEnvKeys` doesn't include `"ZWITCH_ACCESS_KEY"` → Wrong secret name

## Quick Action Items

1. **Check if "Reading Zwitch credentials from Vault" log exists**
   - If NO → Redeploy Edge Function
   - If YES → Check the values

2. **If log exists but credentials are missing:**
   - Go to Supabase Dashboard → Project Settings → Edge Functions → Secrets
   - Verify `ZWITCH_ACCESS_KEY` exists
   - Verify `ZWITCH_SECRET_KEY` exists
   - Check secret names are exact (case-sensitive)

3. **Share the log entry:**
   - Copy the entire "Reading Zwitch credentials from Vault" log entry
   - Share it with me so I can see what's happening

## Expected Log Entry

After redeploying, you should see:

```
Reading Zwitch credentials from Vault: {
  "hasAccessKey": true,
  "accessKeyLength": 48,
  "accessKeyPrefix": "ak_live_C1t1TxfMFXM6c8WVFl",
  "hasSecretKey": true,
  "secretKeyLength": 48,
  "secretKeyPrefix": "sk_live_xxxxx",
  "allEnvKeys": ["ZWITCH_ACCESS_KEY", "ZWITCH_SECRET_KEY", "SUPABASE_URL", ...]
}
```

If you see this with `hasAccessKey: true` and `hasSecretKey: true`, then credentials are being read correctly, and the issue might be with the credentials themselves (wrong values).

