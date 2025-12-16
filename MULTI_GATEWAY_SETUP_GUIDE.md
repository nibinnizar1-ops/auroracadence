# Multi-Gateway Payment System - Setup Guide

## Overview
This guide walks you through setting up the multi-gateway payment system that allows you to configure and switch between multiple payment gateways (Razorpay, PayU, Cashfree, Zwitch) through the admin panel.

---

## Step-by-Step Process

### Phase 1: Database Migrations (You Need to Apply)

#### Step 1.1: Apply Payment Gateways Table Migration
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy the contents of `supabase/migrations/20250114000003_create_payment_gateways_table.sql`
3. Paste and run the SQL
4. Verify: Check that `payment_gateways` table exists in **Table Editor**

#### Step 1.2: Migrate Existing Zwitch Configuration
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy the contents of `supabase/migrations/20250114000004_migrate_existing_gateway_config.sql`
3. **IMPORTANT**: Before running, you need to:
   - Get your `ZWITCH_ACCESS_KEY` from Supabase Edge Functions → Secrets
   - Get your `ZWITCH_SECRET_KEY` from Supabase Edge Functions → Secrets
   - Replace the placeholder values in the migration SQL
4. Paste and run the SQL
5. Verify: Check `payment_gateways` table has one row with `is_active = true`

#### Step 1.3: Update Orders Table
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy the contents of `supabase/migrations/20250114000005_update_orders_for_gateways.sql`
3. Paste and run the SQL
4. Verify: Check that `orders` table has `payment_gateway_id` column

---

### Phase 2: Edge Functions Deployment (You Need to Deploy)

#### Step 2.1: Deploy Updated Payment Functions
The Edge Functions will be refactored. You'll need to:

1. **Deploy `create-payment-order` function:**
   - Go to **Supabase Dashboard** → **Edge Functions**
   - If `create-payment-order` exists, click **Edit**
   - If it doesn't exist, click **Create Function**
   - Copy contents from `supabase/functions/create-payment-order/index.ts`
   - Paste and click **Deploy**

2. **Deploy `verify-payment` function:**
   - Go to **Supabase Dashboard** → **Edge Functions**
   - If `verify-payment` exists, click **Edit**
   - If it doesn't exist, click **Create Function**
   - Copy contents from `supabase/functions/verify-payment/index.ts`
   - Paste and click **Deploy**

3. **Deploy Gateway Adapter Functions:**
   - These will be in `supabase/functions/payment-gateways/` directory
   - You don't need to deploy these separately - they're imported by the main functions

#### Step 2.2: Update Edge Function Secrets (Optional)
- The new system reads credentials from the database
- You can keep existing secrets for backward compatibility
- Or remove them once everything is working

---

### Phase 3: Frontend Updates (Automatic)
- Code changes will be made automatically
- No action needed from you
- Just test the new admin pages after deployment

---

### Phase 4: Testing (You Need to Test)

#### Step 4.1: Test Gateway Configuration
1. Log in to admin panel
2. Go to **Payments** → **Gateways** (new page)
3. You should see Zwitch gateway (from migration)
4. Click **Configure** to verify credentials are loaded
5. Test **Test Connection** button

#### Step 4.2: Test Adding New Gateway
1. In **Payment Gateways** page, click **Add Gateway**
2. Select **Razorpay** (or any other gateway)
3. Fill in test credentials:
   - **Test Mode**: Enable
   - Enter test API keys from gateway dashboard
4. Click **Save & Test Connection**
5. If successful, click **Activate** to make it active

#### Step 4.3: Test Payment Flow
1. Go to frontend website
2. Add items to cart
3. Go to checkout
4. Complete payment with active gateway
5. Verify:
   - Order appears in admin **Orders** page
   - Payment appears in admin **Payments** page
   - Inventory is deducted automatically
   - Order status is "confirmed"

#### Step 4.4: Test Gateway Switching
1. In admin panel, activate a different gateway
2. Previous gateway should automatically deactivate
3. Test payment flow again with new gateway
4. Verify payments work with new gateway

---

## What You'll Need

### For Each Payment Gateway:

#### Razorpay:
- **Key ID** (from Razorpay Dashboard → Settings → API Keys)
- **Key Secret** (from Razorpay Dashboard → Settings → API Keys)
- Test credentials available in Razorpay Test Mode

#### PayU:
- **Merchant Key** (from PayU Dashboard)
- **Merchant Salt** (from PayU Dashboard)
- **Merchant ID** (from PayU Dashboard)
- Test credentials available in PayU Test Mode

#### Cashfree:
- **App ID** (from Cashfree Dashboard)
- **Secret Key** (from Cashfree Dashboard)
- Test credentials available in Cashfree Test Mode

#### Zwitch (Already Configured):
- **Access Key** (already in your Supabase secrets)
- **Secret Key** (already in your Supabase secrets)

---

## Important Notes

1. **Backward Compatibility**: 
   - Old orders will still work
   - Existing Zwitch configuration is migrated automatically
   - Old Edge Function names (`create-razorpay-order`) will be replaced

2. **Security**:
   - Gateway credentials are stored encrypted in database
   - Never expose credentials to frontend
   - Use test mode for testing, live mode for production

3. **Only One Active Gateway**:
   - System ensures only one gateway is active at a time
   - Activating a new gateway automatically deactivates others

4. **Webhook URLs** (Future):
   - Webhook URLs will be displayed in gateway configuration
   - You'll need to configure these in gateway dashboards later
   - For now, payment verification happens via API calls

---

## Troubleshooting

### Issue: Gateway not appearing in admin panel
- **Solution**: Check if migration was applied successfully
- Verify `payment_gateways` table exists and has data

### Issue: Payment fails with "Gateway not configured"
- **Solution**: Ensure a gateway is marked as `is_active = true` in database
- Check gateway credentials are correct

### Issue: Test connection fails
- **Solution**: Verify API keys are correct
- Check if test/live mode matches your credentials
- Ensure gateway account is active

### Issue: Inventory not deducted
- **Solution**: Check Edge Function logs for errors
- Verify `deduct_order_inventory` function exists in database
- Check order status is "confirmed"

---

## Next Steps After Setup

1. Configure all gateways you want to use (in test mode first)
2. Test each gateway thoroughly
3. Switch to live mode when ready
4. Update webhook URLs in gateway dashboards (future enhancement)
5. Monitor payment transactions in admin panel

---

## Support

If you encounter any issues:
1. Check Supabase Edge Function logs
2. Check browser console for frontend errors
3. Verify database migrations were applied
4. Check gateway credentials are correct

