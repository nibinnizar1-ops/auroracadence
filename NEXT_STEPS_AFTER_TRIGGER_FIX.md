# Next Steps After Trigger Fix

## ✅ What You've Done
- Fixed trigger errors
- Table `payment_gateways` should now exist with triggers working

## 📋 Continue with Remaining Migrations

### Step 1: Pre-populate Gateway Types
Run this migration to create all 4 gateway entries:

**File:** `supabase/migrations/20250114000006_prepopulate_gateway_types.sql`

This will create:
- Razorpay (not configured)
- PayU (not configured)
- Cashfree (not configured)
- Zwitch (not configured)

All will have `is_active = false` and empty credentials `{}`.

### Step 2 (Optional): Migrate Existing Zwitch Credentials
If you want to migrate your existing Zwitch credentials from Edge Function secrets:

**File:** `supabase/migrations/20250114000004_migrate_existing_gateway_config.sql`

**Before running:**
1. Get your `ZWITCH_ACCESS_KEY` from Supabase → Edge Functions → Secrets
2. Get your `ZWITCH_SECRET_KEY` from Supabase → Edge Functions → Secrets
3. Replace `'YOUR_ZWITCH_ACCESS_KEY'` and `'YOUR_ZWITCH_SECRET_KEY'` in the SQL

**OR** skip this and configure via admin panel instead.

### Step 3: Update Orders Table
Run this migration to add gateway reference to orders:

**File:** `supabase/migrations/20250114000005_update_orders_for_gateways.sql`

This adds `payment_gateway_id` column to orders table.

## ✅ Verification

After running all migrations, verify:

```sql
-- Check gateways exist
SELECT id, name, code, is_active, 
       CASE WHEN credentials = '{}'::jsonb THEN 'Not Configured' ELSE 'Configured' END as status
FROM public.payment_gateways 
ORDER BY name;

-- Should show 4 rows: Razorpay, PayU, Cashfree, Zwitch
```

## 🎯 Next: Test Admin Panel

1. Go to Admin Panel → Payments → Gateways
2. You should see all 4 gateways listed
3. Click "Configure" on any gateway to enter credentials
4. Click "Activate" to make it active

## 🚀 Then: Deploy Edge Functions

After testing admin panel, deploy:
- `create-payment-order`
- `verify-payment`

