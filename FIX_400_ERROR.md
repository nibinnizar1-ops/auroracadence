# Fix: 400 Bad Request Error

## Problem
The product queries were using `select(*)` which tries to select all columns. If migrations for new columns (`discount_type`, `discount_value`, `default_coupon_id`, etc.) haven't been applied, Supabase returns a 400 error.

## Solution
I've updated all product queries to explicitly list columns instead of using `*`. This makes the queries more robust and prevents 400 errors.

## What Changed

### Files Updated
- `src/lib/products.ts` - All product query functions now explicitly list columns

### Functions Updated
1. `getProducts()` - Main product listing
2. `getProductByHandle()` - Single product by handle
3. `searchProducts()` - Product search
4. `getProductsByCategory()` - Products by category

## Next Steps

### Option 1: Apply Missing Migrations (Recommended)
If you haven't applied these migrations, apply them now:

1. **`20250113000001_add_product_discount_fields.sql`**
   - Adds: `discount_type`, `discount_value`, `discount_valid_from`, `discount_valid_until`, `eligible_for_coupons`

2. **`20250113000013_add_product_coupon_id.sql`**
   - Adds: `default_coupon_id`

**How to apply:**
- Go to Supabase Dashboard → SQL Editor
- Copy and paste the SQL from each migration file
- Run each query

### Option 2: Test Without Migrations
The code now works even if these migrations haven't been applied. The queries will simply not return those columns, and the code handles `null` values gracefully.

## Testing

1. **Refresh your browser** (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
2. **Check browser console** - Should no longer see 400 errors
3. **Check Network tab** - Product API calls should return 200 OK
4. **Verify products show** - Products should now appear on the website

## If Still Getting Errors

If you still see 400 errors after refreshing:

1. **Check which columns exist:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'products' 
   ORDER BY ordinal_position;
   ```

2. **Check browser console** for the exact error message
3. **Share the error** and I'll help fix it

## Expected Result

After this fix:
- ✅ No more 400 Bad Request errors
- ✅ Products should load on the website
- ✅ Console warnings will show if products have invalid variants (for debugging)

