# How to Set Up Zwitch Credentials in Supabase Vault

## Step-by-Step Instructions

### Step 1: Access Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project

### Step 2: Navigate to Edge Functions Secrets
1. Click on **Project Settings** (gear icon in left sidebar)
2. Click on **Edge Functions** in the left menu
3. Scroll down to **Secrets** section

### Step 3: Add ZWITCH_ACCESS_KEY
1. Click **"Add new secret"** or **"New secret"** button
2. **Name:** `ZWITCH_ACCESS_KEY` (exactly this, case-sensitive)
3. **Value:** Your Zwitch access key (e.g., `ak_test_xxxxx` for sandbox or `ak_live_xxxxx` for live)
4. Click **Save** or **Add**

### Step 4: Add ZWITCH_SECRET_KEY
1. Click **"Add new secret"** again
2. **Name:** `ZWITCH_SECRET_KEY` (exactly this, case-sensitive)
3. **Value:** Your Zwitch secret key (e.g., `sk_test_xxxxx` for sandbox or `sk_live_xxxxx` for live)
4. Click **Save** or **Add**

### Step 5: Verify Secrets Are Added
You should see both secrets listed:
- `ZWITCH_ACCESS_KEY`
- `ZWITCH_SECRET_KEY`

### Step 6: Redeploy Edge Function
**IMPORTANT:** After adding secrets, you MUST redeploy the Edge Function for it to access them.

1. Go to **Edge Functions** → `create-payment-order`
2. Click **"Deploy"** or **"Redeploy"** button
3. Wait for deployment to complete

### Step 7: Test Again
Try the payment flow again. The Edge Function should now be able to read the credentials.

## Troubleshooting

### If secrets still not found:
1. **Check secret names:** Must be exactly `ZWITCH_ACCESS_KEY` and `ZWITCH_SECRET_KEY` (case-sensitive)
2. **Check secret values:** Make sure they're not empty
3. **Redeploy:** Edge Functions need to be redeployed after adding secrets
4. **Check project:** Make sure you're in the correct Supabase project

### Verify Secrets Are Set:
You can check if secrets are accessible by looking at Edge Function logs. After redeploying, the logs should show:
```
Reading Zwitch credentials from Vault: {
  hasAccessKey: true,
  accessKeyPrefix: "ak_test_...",
  hasSecretKey: true,
  ...
}
```

## Important Notes

- Secrets are **case-sensitive**
- Secrets are **project-specific** (each project has its own secrets)
- Edge Functions must be **redeployed** after adding/updating secrets
- Secrets are **encrypted** and stored securely in Supabase Vault
- Never commit secrets to git or expose them in frontend code

