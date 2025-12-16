# Fix "Failed to initiate payment" Error

## Issue
The checkout page is trying to call the old Edge Function name `create-razorpay-order`, but we've created a new gateway-agnostic function `create-payment-order`.

## Solutions

### Option 1: Deploy New Edge Functions (Recommended)

1. **Deploy `create-payment-order` Edge Function:**
   - Go to Supabase Dashboard → Edge Functions
   - Click "Create Function"
   - Name: `create-payment-order`
   - Copy contents from: `supabase/functions/create-payment-order/index.ts`
   - Paste and click "Deploy"

2. **Deploy `verify-payment` Edge Function:**
   - Go to Supabase Dashboard → Edge Functions
   - Click "Create Function"
   - Name: `verify-payment`
   - Copy contents from: `supabase/functions/verify-payment/index.ts`
   - Paste and click "Deploy"

3. **Ensure Gateway Adapters are Available:**
   - The gateway adapter files need to be in the same directory structure
   - If using Supabase CLI: They should be in `supabase/functions/payment-gateways/`
   - If using Dashboard: You may need to bundle them or they should be imported correctly

### Option 2: Keep Old Functions (Temporary)

If you want to keep using the old functions temporarily:

1. Keep `create-razorpay-order` Edge Function as is
2. Keep `verify-razorpay-payment` Edge Function as is
3. The checkout page will work with Zwitch only

### Option 3: Check Active Gateway

Make sure you have an active gateway configured:

1. Go to Admin Panel → Payments → Gateways
2. Verify a gateway is marked as "Active" (green badge)
3. If no gateway is active, click "Activate" on a configured gateway

## Quick Check

Run this SQL to verify active gateway:

```sql
SELECT id, name, code, is_active, 
       CASE WHEN credentials = '{}'::jsonb THEN 'Not Configured' ELSE 'Configured' END as status
FROM public.payment_gateways 
WHERE is_active = true;
```

Should return 1 row with `is_active = true` and `status = 'Configured'`.

## After Fixing

1. Refresh your frontend
2. Try checkout again
3. Check browser console for any errors
4. Check Supabase Edge Function logs for errors

