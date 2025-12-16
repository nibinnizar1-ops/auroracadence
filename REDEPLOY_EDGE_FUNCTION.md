# Redeploy Edge Function with Improved Error Handling

I've improved the error handling in the Edge Function. Please redeploy it to see more detailed error messages.

## Steps to Redeploy

1. **Open Supabase Dashboard** → **Edge Functions**
2. Click on **`create-payment-order`**
3. Click **"Edit"** or **"Update"**
4. **Copy the entire contents** of `supabase/functions/create-payment-order/index.ts`
5. **Paste** into the editor
6. Click **"Deploy"**

## What I Fixed

1. ✅ **Better error messages** - Now shows exact error from Zwitch API
2. ✅ **Amount conversion** - Fixed to convert rupees to paise for Zwitch API
3. ✅ **Gateway error handling** - Catches and reports gateway-specific errors
4. ✅ **Order cleanup** - Deletes order if gateway fails
5. ✅ **Detailed logging** - Logs request details for debugging

## After Redeploying

1. Try to pay again
2. Check **Edge Function Logs** (Dashboard → Edge Functions → `create-payment-order` → Logs)
3. **Share the exact error message** from the logs

The improved error handling will now show:
- Exact Zwitch API error
- Request details (URL, body)
- Which step failed

This will help us identify the exact issue!

