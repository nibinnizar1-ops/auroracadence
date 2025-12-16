# Multi-Gateway Payment System - Deployment Instructions

## Quick Start

After all code is implemented, follow these steps to deploy:

### Step 1: Apply Database Migrations

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Run migrations in this order:
   - `20250114000003_create_payment_gateways_table.sql`
   - `20250114000004_migrate_existing_gateway_config.sql` (⚠️ Replace credentials first!)
   - `20250114000005_update_orders_for_gateways.sql`

### Step 2: Deploy Edge Functions

1. **Deploy `create-payment-order`:**
   - Supabase Dashboard → Edge Functions → Create Function
   - Name: `create-payment-order`
   - Copy contents from `supabase/functions/create-payment-order/index.ts`
   - Deploy

2. **Deploy `verify-payment`:**
   - Supabase Dashboard → Edge Functions → Create Function
   - Name: `verify-payment`
   - Copy contents from `supabase/functions/verify-payment/index.ts`
   - Deploy

3. **Upload Gateway Adapters:**
   - The gateway adapter files need to be accessible to Edge Functions
   - They should be in `supabase/functions/payment-gateways/` directory
   - Supabase CLI: `supabase functions deploy create-payment-order --no-verify-jwt`
   - Or upload via Supabase Dashboard (if supported)

### Step 3: Update Frontend

- Code changes are automatic
- Just refresh your admin panel
- New "Payment Gateways" link will appear in sidebar

### Step 4: Test

1. Go to Admin → Payments → Gateways
2. Verify Zwitch gateway is configured (from migration)
3. Test adding a new gateway
4. Test payment flow

---

## Important Notes

- Old Edge Functions (`create-razorpay-order`, `verify-razorpay-payment`) can be kept for backward compatibility or removed
- Gateway credentials are stored in database (encrypted in production)
- Only one gateway can be active at a time

