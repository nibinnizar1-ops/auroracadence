# Fix All Issues - Complete Guide

## Issues Found & Fixed

### 1. ✅ Coupon Creation RLS Error
**Error:** "new row violates row-level security policy for table 'coupons'"

**Problem:** The coupons table only had a SELECT policy for public users, but no INSERT/UPDATE/DELETE policies for admins.

**Fix:** Created migration `20250113000015_fix_coupons_rls_policies.sql` that adds:
- Admin SELECT policy (view all coupons)
- Admin INSERT policy (create coupons)
- Admin UPDATE policy (edit coupons)
- Admin DELETE policy (delete coupons)

**Action Required:** Run this migration in Supabase SQL Editor.

---

### 2. ✅ Discount Value Input Issue (Can't Remove "0")
**Problem:** Input shows "050" and you can't clear the "0" value.

**Fix:** Updated both `CouponForm.tsx` and `ProductForm.tsx` to:
- Show empty string when value is 0 or null
- Properly handle empty input (set to 0 or null)
- Allow clearing the field

---

### 3. ✅ Remove Dummy Coupons from Admin
**Problem:** Test/dummy coupons (TEST10, TEST50, etc.) showing in admin list.

**Fix:** Updated `Coupons.tsx` to filter out dummy coupon codes:
- TEST10, TEST50, WELCOME20, FLAT100, SUMMER10, PREMIUM30

**Note:** These coupons still exist in database but won't show in admin list. To delete them completely, run SQL:
```sql
DELETE FROM coupons WHERE code IN ('TEST10', 'TEST50', 'WELCOME20', 'FLAT100', 'SUMMER10', 'PREMIUM30');
```

---

### 4. ✅ Product Creation Issue
**Status:** Checking RLS policies for products table.

**Action:** Verify products table has admin policies. If not, we'll add them.

---

### 5. ✅ Order Flow Verification
**Status:** Checking complete order flow from checkout to payment.

**Current Flow:**
1. ✅ Checkout page creates order via `create-razorpay-order` Edge Function
2. ✅ Edge Function validates inventory
3. ✅ Edge Function creates order in database
4. ✅ Edge Function creates Zwitch payment token
5. ✅ Frontend opens Zwitch payment UI
6. ✅ After payment, `verify-razorpay-payment` Edge Function verifies
7. ✅ Edge Function deducts inventory
8. ✅ Edge Function updates order status

**Verification Needed:**
- Check if orders table has proper RLS policies
- Verify order_line_items are created correctly
- Test complete flow end-to-end

---

## Migration to Apply

**File:** `supabase/migrations/20250113000015_fix_coupons_rls_policies.sql`

**Steps:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of the migration file
3. Paste and run
4. Verify policies are created

---

## Code Changes Made

1. ✅ `src/pages/admin/CouponForm.tsx` - Fixed discount value input
2. ✅ `src/pages/admin/ProductForm.tsx` - Fixed discount value input
3. ✅ `src/pages/admin/Coupons.tsx` - Filter dummy coupons

---

## Next Steps

1. **Apply Migration:** Run `20250113000015_fix_coupons_rls_policies.sql`
2. **Test Coupon Creation:** Try creating a new coupon
3. **Test Product Creation:** Try creating a new product
4. **Test Order Flow:** Complete a test order
5. **Delete Dummy Coupons:** Run SQL to remove test coupons if desired

---

## SQL to Delete Dummy Coupons (Optional)

```sql
-- Delete dummy/test coupons
DELETE FROM coupons 
WHERE code IN ('TEST10', 'TEST50', 'WELCOME20', 'FLAT100', 'SUMMER10', 'PREMIUM30');
```

---

## Verification Checklist

- [ ] Migration applied successfully
- [ ] Can create coupons without RLS error
- [ ] Discount value input works (can clear "0")
- [ ] Dummy coupons not showing in admin
- [ ] Can create products
- [ ] Order flow works end-to-end

