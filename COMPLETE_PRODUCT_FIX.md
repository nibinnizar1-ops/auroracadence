# Complete Product Visibility Fix

## What I Fixed

### 1. Removed New Column References
- Removed `discount_type`, `discount_value`, `default_coupon_id`, etc. from queries
- Now only selecting base columns that definitely exist
- This prevents 400 errors if migrations haven't been applied

### 2. Improved Error Handling
- Changed `throw error` to `return []` or `return null`
- Added detailed error logging
- Products page won't crash if query fails

### 3. Added Variant Validation
- `getProductByHandle` now checks for valid variants
- Returns `null` if product has no valid variants
- This prevents "Product Not Found" when product exists but has invalid data

## Next Steps

### Step 1: Verify Your Product Exists
Run this in Supabase SQL Editor:

```sql
-- List all products
SELECT id, title, handle, status, created_at 
FROM products 
ORDER BY created_at DESC 
LIMIT 10;
```

### Step 2: Check Product Details
Replace `YOUR_PRODUCT_ID` with your actual product ID:

```sql
SELECT 
  p.id,
  p.title,
  p.handle,
  p.status,
  COUNT(DISTINCT pv.id) as variant_count,
  MIN(pv.price) as min_price,
  BOOL_OR(pv.available = true) as has_available_variant
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'YOUR_PRODUCT_ID'
GROUP BY p.id, p.title, p.handle, p.status;
```

### Step 3: Check Variant Requirements
```sql
SELECT 
  p.title as product,
  p.status,
  pv.title as variant_size,
  pv.price,
  pv.available,
  CASE 
    WHEN p.status != 'active' THEN '❌ Product not active'
    WHEN pv.id IS NULL THEN '❌ No variants'
    WHEN pv.price IS NULL OR pv.price = 0 THEN '❌ No price'
    WHEN pv.available = false THEN '❌ Variant not available'
    WHEN pv.title IS NULL OR pv.title = '' THEN '❌ No size'
    ELSE '✅ OK'
  END as issue
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'YOUR_PRODUCT_ID';
```

### Step 4: Quick Fixes (if needed)
```sql
-- Make product active
UPDATE products SET status = 'active' WHERE id = 'YOUR_PRODUCT_ID';

-- Fix variant price
UPDATE product_variants 
SET price = 1000  -- Set your price
WHERE product_id = 'YOUR_PRODUCT_ID' AND (price IS NULL OR price = 0);

-- Fix variant availability
UPDATE product_variants 
SET available = true 
WHERE product_id = 'YOUR_PRODUCT_ID';

-- Fix variant size
UPDATE product_variants 
SET title = 'Default'  -- Or 'Small', 'Medium', etc.
WHERE product_id = 'YOUR_PRODUCT_ID' AND (title IS NULL OR title = '');
```

## Testing

1. **Hard refresh browser** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check browser console** - Should see detailed logs
3. **Check Network tab** - API calls should return 200 OK
4. **Verify product shows** - Product should appear on website

## What to Look For in Console

### Good Signs:
- `[getProducts] Found X products with valid variants`
- No 400 errors
- Products loading

### Warning Signs:
- `[Product ...] - No variants found`
- `[Product ...] - Invalid variant: available=false, price=0`
- `[getProductByHandle] Product has no valid variants`

## If Still Not Working

1. **Check product handle** - Make sure the URL matches the product's handle
2. **Check browser console** - Look for specific error messages
3. **Run SQL diagnostic** - Use `VERIFY_PRODUCT_EXISTS.sql`
4. **Share console logs** - Copy the exact error messages

## Expected Result

After this fix:
- ✅ No more 400 Bad Request errors
- ✅ Products with valid data will show
- ✅ Clear console warnings for invalid products
- ✅ "Product Not Found" only when product truly doesn't exist or has invalid data

