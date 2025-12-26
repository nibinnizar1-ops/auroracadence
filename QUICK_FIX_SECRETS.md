# Quick Fix: Zwitch Credentials Not Found

## The Problem
Edge Function can't find `ZWITCH_ACCESS_KEY` and `ZWITCH_SECRET_KEY` in Supabase Vault.

## Solution: 3 Steps

### Step 1: Add Secrets to Supabase Vault

1. **Go to Supabase Dashboard**
   - URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID`

2. **Navigate to Secrets**
   - Click **Project Settings** (⚙️ icon)
   - Click **Edge Functions** in left menu
   - Scroll to **Secrets** section

3. **Add First Secret**
   - Click **"New secret"** or **"Add new secret"**
   - **Name:** `ZWITCH_ACCESS_KEY` (exactly, case-sensitive)
   - **Value:** Your access key (e.g., `ak_test_xxxxx`)
   - Click **Save**

4. **Add Second Secret**
   - Click **"New secret"** again
   - **Name:** `ZWITCH_SECRET_KEY` (exactly, case-sensitive)
   - **Value:** Your secret key (e.g., `sk_test_xxxxx`)
   - Click **Save**

### Step 2: Verify Secrets Are Added

You should see both secrets listed:
```
✅ ZWITCH_ACCESS_KEY
✅ ZWITCH_SECRET_KEY
```

### Step 3: REDEPLOY Edge Function ⚠️ IMPORTANT

**This is critical!** Edge Functions only load secrets when deployed.

1. Go to **Edge Functions** → `create-payment-order`
2. Click **"Deploy"** or **"Redeploy"** button
3. Wait for deployment to complete (green checkmark)

### Step 4: Test Again

Try the payment flow. It should work now!

## Common Mistakes

❌ **Wrong secret names:** Must be exactly `ZWITCH_ACCESS_KEY` and `ZWITCH_SECRET_KEY`
❌ **Forgot to redeploy:** Secrets only load on deployment
❌ **Wrong project:** Make sure you're in the correct Supabase project
❌ **Empty values:** Make sure secret values are not empty

## Verify It's Working

After redeploying, check Edge Function logs. You should see:
```
Reading Zwitch credentials from Vault: {
  hasAccessKey: true,
  accessKeyPrefix: "ak_test_...",
  hasSecretKey: true,
  ...
}
```

If you still see `hasAccessKey: false`, the secrets aren't set correctly or the function wasn't redeployed.

