# Your Action Items - Multi-Gateway Payment System

## ✅ What's Been Implemented

1. ✅ Database migrations created
2. ✅ Gateway adapter system (Razorpay, PayU, Cashfree, Zwitch)
3. ✅ Refactored Edge Functions (create-payment-order, verify-payment)
4. ✅ Admin API functions
5. ✅ Admin UI pages (in progress)

## 📋 What You Need to Do

### Step 1: Apply Database Migrations (DO THIS FIRST)

1. **Go to Supabase Dashboard → SQL Editor**

2. **Run Migration 1:**
   - Copy contents of: `supabase/migrations/20250114000003_create_payment_gateways_table.sql`
   - Paste and run in SQL Editor
   - ✅ Verify: Check that `payment_gateways` table exists

3. **Run Migration 2:**
   - Copy contents of: `supabase/migrations/20250114000006_prepopulate_gateway_types.sql`
   - Paste and run in SQL Editor
   - ✅ Verify: Check `payment_gateways` table has 4 rows (Razorpay, PayU, Cashfree, Zwitch)
   - All should show `is_active = false` and `credentials = {}` (not configured yet)

4. **Run Migration 3 (OPTIONAL - Only if you want to migrate existing Zwitch credentials):**
   - Copy contents of: `supabase/migrations/20250114000004_migrate_existing_gateway_config.sql`
   - **BEFORE RUNNING:**
     - Go to Supabase Dashboard → Edge Functions → Secrets
     - Get your `ZWITCH_ACCESS_KEY` value
     - Get your `ZWITCH_SECRET_KEY` value
     - In the SQL, replace:
       - `'YOUR_ZWITCH_ACCESS_KEY'` with your actual access key
       - `'YOUR_ZWITCH_SECRET_KEY'` with your actual secret key
   - Paste and run in SQL Editor
   - ✅ Verify: Check Zwitch gateway has credentials set
   - **NOTE:** You can skip this and configure via admin panel instead

5. **Run Migration 4:**
   - Copy contents of: `supabase/migrations/20250114000005_update_orders_for_gateways.sql`
   - Paste and run in SQL Editor
   - ✅ Verify: Check that `orders` table has `payment_gateway_id` column

### Step 2: Wait for Code Completion

I'm still implementing:
- Admin UI pages for gateway management
- Frontend gateway SDK loader
- Checkout page updates

**Wait for my completion message before proceeding to Step 3.**

### Step 3: Deploy Edge Functions (After Code Completion)

1. **Deploy `create-payment-order`:**
   - Supabase Dashboard → Edge Functions
   - Click "Create Function" or find existing
   - Name: `create-payment-order`
   - Copy contents from: `supabase/functions/create-payment-order/index.ts`
   - Paste and click "Deploy"

2. **Deploy `verify-payment`:**
   - Supabase Dashboard → Edge Functions
   - Click "Create Function" or find existing
   - Name: `verify-payment`
   - Copy contents from: `supabase/functions/verify-payment/index.ts`
   - Paste and click "Deploy"

3. **Note on Gateway Adapters:**
   - The adapter files are imported by the main functions
   - If using Supabase CLI, they should be in the same directory structure
   - If using Dashboard, you may need to bundle them or use imports

### Step 4: Test

1. **Refresh Admin Panel:**
   - New "Payment Gateways" link should appear in sidebar (under Payments)

2. **Test Gateway Configuration:**
   - Go to Admin → Payments → Gateways (or click "Manage Gateways" button)
   - You should see 4 gateways: Razorpay, PayU, Cashfree, Zwitch
   - All should show "Not Configured" status
   - Click "Configure" on any gateway (e.g., Zwitch)
   - Enter your Access Key and Secret Key
   - Toggle Test Mode if needed
   - Click "Test Connection" to verify credentials
   - Click "Save Configuration"
   - Go back to list page
   - Click "Activate" on the configured gateway
   - Gateway should now show "Active" status

3. **Test Payment Flow:**
   - Go to frontend website
   - Add items to cart
   - Complete checkout
   - Verify payment works

---

## ⚠️ Important Notes

1. **Backward Compatibility:**
   - Old Edge Functions can be kept or removed
   - Existing orders will still work
   - Old field names (`razorpay_order_id`) are kept for compatibility

2. **Credentials Security:**
   - Gateway credentials are stored in database
   - In production, implement encryption (future enhancement)
   - Never expose credentials to frontend

3. **Only One Active Gateway:**
   - System ensures only one gateway is active
   - Activating a new gateway automatically deactivates others

---

## 🆘 Troubleshooting

**Issue: Migration fails**
- Check SQL syntax
- Verify you have admin permissions
- Check Supabase logs

**Issue: Gateway not appearing**
- Verify migration was applied
- Check `payment_gateways` table has data
- Refresh admin panel

**Issue: Payment fails**
- Check Edge Function logs
- Verify gateway is active (`is_active = true`)
- Check gateway credentials are correct

---

## 📞 Next Steps After Setup

1. Configure additional gateways (Razorpay, PayU, Cashfree) in test mode
2. Test each gateway thoroughly
3. Switch to live mode when ready
4. Monitor payments in admin panel

