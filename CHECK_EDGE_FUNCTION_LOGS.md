# Check Edge Function Logs - Critical Step!

The error "Edge Function returned a non-2xx status code" means the function is running but hitting an error. We need to see the **actual error message** from the logs.

## Step 1: Check Edge Function Logs (MOST IMPORTANT!)

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Click on **`create-payment-order`**
3. Click on **"Logs"** tab (or "View Logs")
4. **Try to pay again** (click "Pay now")
5. **Look for the red error message** in the logs
6. **Copy the entire error message** including:
   - The error text
   - Stack trace (if shown)
   - Any console.error messages

## Step 2: What to Look For

The logs will show something like:
```
Error in create-payment-order: [error message]
Error stack: [stack trace]
```

Common errors you might see:
- `No active payment gateway configured`
- `Zwitch credentials not configured`
- `Failed to create Zwitch payment token: [API error]`
- `column "payment_gateway_id" does not exist`
- `Failed to create order in database`

## Step 3: Share the Error

Once you have the error from the logs, share it with me and I can provide a specific fix!

## Quick Check: Verify Function is Deployed

1. Go to **Supabase Dashboard** → **Edge Functions**
2. Verify **`create-payment-order`** is listed
3. Check the **"Last Updated"** timestamp - should be recent if you just deployed

If it's not there or old:
- Deploy it using the code from `supabase/functions/create-payment-order/index.ts`

