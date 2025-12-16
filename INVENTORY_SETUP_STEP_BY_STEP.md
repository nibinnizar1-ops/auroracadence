# Inventory System Setup - Step by Step Guide

## 📋 Overview

You need to:
1. ✅ Apply database migration (creates inventory functions)
2. ✅ Update Edge Functions (adds inventory logic)

**Time Required**: ~10 minutes

---

## Step 1: Apply Database Migration

### What This Does:
Creates 5 database functions for inventory management:
- `deduct_inventory()` - Deducts stock when order is placed
- `restore_inventory()` - Restores stock on cancellation/return
- `check_inventory_availability()` - Checks if stock is available
- `deduct_order_inventory()` - Deducts inventory for entire order
- `restore_order_inventory()` - Restores inventory for entire order

### How to Apply:

1. **Open Supabase Dashboard**
   - Go to your project: https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on **"SQL Editor"** in the left sidebar
   - (It's usually below "Table Editor")

3. **Create New Query**
   - Click **"+ New query"** button (top right)
   - Or use the existing query editor

4. **Copy Migration SQL**
   - Open the file: `supabase/migrations/20250101000013_create_inventory_functions.sql`
   - Copy **ALL** the contents (Ctrl/Cmd + A, then Ctrl/Cmd + C)

5. **Paste and Run**
   - Paste into the SQL Editor
   - Click **"Run"** button (or press Ctrl/Cmd + Enter)
   - Wait for execution to complete

6. **Verify Success**
   - You should see: ✅ "Success. No rows returned"
   - If you see errors, check the error message

### ✅ Verification:
Run this test query to verify functions exist:
```sql
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%inventory%';
```

You should see 5 functions listed.

---

## Step 2: Update Edge Functions

### What This Does:
Updates the order creation and payment verification functions to:
- Validate inventory before creating orders
- Deduct inventory when payment is confirmed
- Create order_line_items with variant_id for tracking

### Function 1: Update `create-razorpay-order`

1. **Navigate to Edge Functions**
   - Click **"Edge Functions"** in the left sidebar
   - (Usually below "Storage")

2. **Find the Function**
   - Look for **`create-razorpay-order`** in the list
   - Click on it to open

3. **Update the Code**
   - Click **"Edit"** or **"Update"** button
   - Open the file: `supabase/functions/create-razorpay-order/index.ts`
   - Copy **ALL** the contents
   - Replace the existing code in Supabase
   - Click **"Deploy"** or **"Save"**

4. **Verify Deployment**
   - You should see a success message
   - Check the function logs to ensure no errors

### Function 2: Update `verify-razorpay-payment`

1. **Find the Function**
   - In Edge Functions list, find **`verify-razorpay-payment`**
   - Click on it to open

2. **Update the Code**
   - Click **"Edit"** or **"Update"** button
   - Open the file: `supabase/functions/verify-razorpay-payment/index.ts`
   - Copy **ALL** the contents
   - Replace the existing code in Supabase
   - Click **"Deploy"** or **"Save"**

3. **Verify Deployment**
   - You should see a success message
   - Check the function logs to ensure no errors

---

## Step 3: Test the System

### Test 1: Verify Database Functions

1. **Go to SQL Editor**
2. **Run this test query:**
```sql
-- Test with a real variant ID from your product_variants table
-- First, get a variant ID:
SELECT id, title, inventory_quantity 
FROM product_variants 
LIMIT 1;

-- Then test the check function (replace VARIANT_ID with actual ID):
SELECT check_inventory_availability(
  'VARIANT_ID_HERE'::uuid,
  5
);
```

**Expected Result**: Should return JSON with `available: true/false`

### Test 2: Test Order Creation

1. **Create a test product** (if you don't have one):
   - Go to Admin Panel → Products
   - Create a product with a variant
   - Set inventory quantity (e.g., 10)

2. **Add to cart and checkout**:
   - Add the product to cart
   - Try to add more than available → Should show error
   - Complete checkout with valid quantity
   - Check inventory → Should be reduced

3. **Verify Inventory Deduction**:
   - Go to Table Editor → `product_variants`
   - Check the `inventory_quantity` column
   - Should be reduced by the quantity ordered

### Test 3: Check Order Line Items

1. **Go to Table Editor** → `order_line_items`
2. **Check recent orders**:
   - Should have `variant_id` populated
   - Should have `quantity` matching order

---

## Step 4: Verify Everything Works

### Checklist:

- [ ] Database functions created (Step 1)
- [ ] `create-razorpay-order` function updated (Step 2)
- [ ] `verify-razorpay-payment` function updated (Step 2)
- [ ] Test query works (Step 3)
- [ ] Can add items to cart (with stock validation)
- [ ] Cannot add out-of-stock items
- [ ] Order creation works
- [ ] Inventory deducts after payment
- [ ] Order line items have variant_id

---

## 🐛 Troubleshooting

### Issue: "Function not found" error
**Solution**: Make sure you applied Step 1 (migration) first

### Issue: "Permission denied" error
**Solution**: The functions use service role, should work automatically. If not, check RLS policies.

### Issue: Inventory not deducting
**Solution**: 
- Check Edge Function logs for errors
- Verify `order_line_items` has `variant_id` populated
- Check if payment was actually confirmed

### Issue: "Variant not found" error
**Solution**: Make sure `variant_id` is being sent from checkout (already updated in code)

---

## 📝 Files Reference

**Files You Need:**
1. `supabase/migrations/20250101000013_create_inventory_functions.sql` → Apply in SQL Editor
2. `supabase/functions/create-razorpay-order/index.ts` → Deploy in Edge Functions
3. `supabase/functions/verify-razorpay-payment/index.ts` → Deploy in Edge Functions

**Files Already Updated (No Action Needed):**
- ✅ `src/lib/inventory.ts` - Frontend inventory checks
- ✅ `src/stores/cartStore.ts` - Cart validation
- ✅ `src/pages/Checkout.tsx` - Checkout validation

---

## 🎯 Quick Summary

1. **SQL Editor** → Paste migration → Run ✅
2. **Edge Functions** → Update `create-razorpay-order` → Deploy ✅
3. **Edge Functions** → Update `verify-razorpay-payment` → Deploy ✅
4. **Test** → Create order → Check inventory ✅

**That's it!** Your inventory system will be fully functional. 🚀

---

## 💡 Pro Tips

1. **Backup First**: Before applying, you can export your database schema (optional)
2. **Test in Staging**: If you have a staging environment, test there first
3. **Monitor Logs**: Check Edge Function logs after deployment for any errors
4. **Start Small**: Test with one product first before going live

---

## ✅ Success Indicators

After completing all steps, you should see:
- ✅ Inventory automatically deducts when orders are placed
- ✅ Users can't add out-of-stock items to cart
- ✅ Checkout validates stock before payment
- ✅ Order line items have variant_id for tracking
- ✅ Low stock items can be identified (for future dashboard widget)

**Need help?** Let me know if you encounter any issues! 🎯



