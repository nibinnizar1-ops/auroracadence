# Edge Function Deployment Instructions

## Prerequisites
- Access to Supabase Dashboard
- Edge Functions already created (or create them if they don't exist)

## Deploy create-payment-order Edge Function

### Step 1: Access Edge Function
1. Go to **Supabase Dashboard**
2. Click **"Edge Functions"** in the left sidebar
3. Find **`create-payment-order`** in the list
4. Click on it to open

### Step 2: Edit Code
1. Click **"Code"** tab (or "Edit" button)
2. **Select all existing code** (Ctrl+A or Cmd+A)
3. **Delete it** (Backspace or Delete)

### Step 3: Copy New Code
1. Open `supabase/functions/create-payment-order/index.ts` in your code editor
2. **Select all** (Ctrl+A or Cmd+A)
3. **Copy** (Ctrl+C or Cmd+C)

### Step 4: Paste and Deploy
1. **Paste** the code into the Supabase editor (Ctrl+V or Cmd+V)
2. Click **"Deploy"** button (usually at top right)
3. Wait for deployment to complete
4. You should see "Deployed successfully" or similar message

### Step 5: Verify Deployment
1. Check the **"Logs"** tab
2. Look for any deployment errors
3. If successful, you're done!

## Deploy verify-payment Edge Function

### Step 1: Access Edge Function
1. Go to **Supabase Dashboard** → **Edge Functions**
2. Find **`verify-payment`** in the list
   - If it doesn't exist, click **"Create Function"** and name it `verify-payment`
3. Click on it to open

### Step 2-5: Same as above
Follow the same steps as `create-payment-order`:
1. Click **"Code"** tab
2. Delete all existing code
3. Copy from `supabase/functions/verify-payment/index.ts`
4. Paste and click **"Deploy"**
5. Verify deployment

## Verification

After deploying both functions:

1. Go to **Edge Functions** list
2. Both should show:
   - ✅ `create-payment-order`
   - ✅ `verify-payment`
3. Check **"Last Updated"** timestamp is recent

## Troubleshooting

### Issue: "Function not found"
**Solution:** Create the function first:
1. Click **"Create Function"**
2. Name it exactly: `create-payment-order` or `verify-payment`
3. Then follow deployment steps

### Issue: "Deployment failed"
**Solution:**
1. Check for syntax errors in the code
2. Make sure you copied the entire file
3. Check Supabase logs for specific error

### Issue: "Function exists but old code"
**Solution:**
1. Make sure you replaced ALL code
2. Check "Last Updated" timestamp
3. Redeploy if timestamp is old

## Quick Checklist

- [ ] `create-payment-order` function exists
- [ ] `verify-payment` function exists
- [ ] Both functions have latest code
- [ ] Both functions deployed successfully
- [ ] "Last Updated" timestamp is recent
- [ ] No errors in deployment logs
