# Inventory System - Setup Steps

## ✅ What You Need to Do

### Step 1: Apply Database Migration

**File**: `supabase/migrations/20250101000013_create_inventory_functions.sql`

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/20250101000013_create_inventory_functions.sql`
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Verify no errors appear

**Option B: Using Supabase CLI**
```bash
# If you have Supabase CLI installed
supabase db push
```

**What This Does:**
- Creates 5 database functions for inventory management
- Grants necessary permissions
- No data changes, only adds functions

---

### Step 2: Deploy Updated Edge Functions

**Files to Deploy:**
1. `supabase/functions/create-razorpay-order/index.ts`
2. `supabase/functions/verify-razorpay-payment/index.ts`

**Option A: Using Supabase Dashboard**
1. Go to **Edge Functions** in your Supabase Dashboard
2. For each function:
   - Click on the function name
   - Click **Edit** or **Update**
   - Replace the code with the updated version
   - Click **Deploy**

**Option B: Using Supabase CLI**
```bash
# Deploy create-razorpay-order function
supabase functions deploy create-razorpay-order

# Deploy verify-razorpay-payment function
supabase functions deploy verify-razorpay-payment
```

**What Changed:**
- `create-razorpay-order`: 
  - Added inventory validation before order creation
  - Creates `order_line_items` with `variant_id` for tracking
  
- `verify-razorpay-payment`:
  - Deducts inventory when payment is confirmed
  - Calls `deduct_order_inventory()` function

---

### Step 3: Verify Functions Are Working

**Test Database Functions:**
1. Go to **SQL Editor** in Supabase Dashboard
2. Run this test query:
```sql
-- Test inventory check function
SELECT check_inventory_availability(
  'YOUR_VARIANT_ID_HERE'::uuid,
  5
);
```

**Test Edge Functions:**
- The functions will be tested automatically when orders are placed
- Check function logs in Supabase Dashboard → Edge Functions → Logs

---

## ⚠️ Important Notes

1. **No Data Loss**: These changes only add functionality, they don't modify existing data
2. **Backward Compatible**: Existing orders will continue to work
3. **Inventory Tracking**: New orders will automatically track inventory
4. **Old Orders**: Orders created before this update won't have inventory deducted (they're already completed)

---

## 🧪 Testing Checklist

After applying changes:

- [ ] Database functions are accessible (test with SQL query)
- [ ] Edge Functions are deployed successfully
- [ ] Create a test order → Check if inventory is deducted
- [ ] Check order_line_items table → Should have variant_id populated
- [ ] Try adding out-of-stock item to cart → Should show error

---

## 📝 Quick Reference

**Files Changed:**
- ✅ `supabase/migrations/20250101000013_create_inventory_functions.sql` - **Apply this migration**
- ✅ `supabase/functions/create-razorpay-order/index.ts` - **Deploy this function**
- ✅ `supabase/functions/verify-razorpay-payment/index.ts` - **Deploy this function**

**Frontend Files (No Supabase Action Needed):**
- ✅ `src/lib/inventory.ts` - Already in your codebase
- ✅ `src/stores/cartStore.ts` - Already updated
- ✅ `src/pages/Checkout.tsx` - Already updated

---

## 🚀 Ready to Apply?

1. **Apply the migration** (Step 1)
2. **Deploy the Edge Functions** (Step 2)
3. **Test with a real order** (Step 3)

That's it! The inventory system will be fully functional. 🎯



