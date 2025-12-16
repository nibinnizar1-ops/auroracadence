# Debug: Product Active But Not Showing

## Checklist

Since product is Active and has variants, check these:

### 1. Check Variant Data
Run this SQL to check your product's variants:

```sql
SELECT 
  p.id as product_id,
  p.title as product_title,
  p.status,
  pv.id as variant_id,
  pv.title as variant_size,
  pv.price,
  pv.available,
  pv.inventory_quantity,
  pv.inventory_policy,
  CASE 
    WHEN pv.price IS NULL OR pv.price = 0 THEN '❌ No price'
    WHEN pv.title IS NULL OR pv.title = '' THEN '❌ No size'
    WHEN pv.available = false THEN '❌ Not available'
    WHEN pv.inventory_policy = 'deny' AND pv.inventory_quantity = 0 THEN '❌ Out of stock (deny policy)'
    ELSE '✅ OK'
  END as variant_status
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'YOUR_PRODUCT_ID'  -- Replace with your product ID
ORDER BY pv.position;
```

### 2. Check Browser Console
1. Open website
2. Press F12 (DevTools)
3. Go to Console tab
4. Look for errors when loading products
5. Check Network tab for failed API calls

### 3. Check RLS Policies
Verify public can read active products:

```sql
-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'products';
```

### 4. Test Product Query Directly
Run this to see what the frontend query returns:

```sql
-- Simulate frontend query
SELECT 
  p.*,
  COUNT(pv.id) as variant_count,
  COUNT(pi.id) as image_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.status = 'active'
  AND p.id = 'YOUR_PRODUCT_ID'  -- Replace with your product ID
GROUP BY p.id;
```

### 5. Check Variant Requirements
Variants must have:
- ✅ `title` (Size) - NOT empty
- ✅ `price` - Greater than 0
- ✅ `available` - Should be `true`
- ✅ `inventory_quantity` - Can be 0, but should be set
- ✅ `inventory_policy` - "deny" or "continue"

### 6. Check Product Images
While not required, products without images might not display properly.

```sql
-- Check if product has images
SELECT 
  p.title,
  COUNT(pi.id) as image_count
FROM products p
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.id = 'YOUR_PRODUCT_ID'
GROUP BY p.id, p.title;
```

## Common Issues

### Issue 1: Variant Price is 0 or NULL
**Fix:**
```sql
UPDATE product_variants 
SET price = 1000  -- Set your price
WHERE product_id = 'YOUR_PRODUCT_ID' AND (price IS NULL OR price = 0);
```

### Issue 2: Variant Size (title) is Empty
**Fix:**
```sql
UPDATE product_variants 
SET title = 'Default'  -- Set a size
WHERE product_id = 'YOUR_PRODUCT_ID' AND (title IS NULL OR title = '');
```

### Issue 3: Variant available = false
**Fix:**
```sql
UPDATE product_variants 
SET available = true 
WHERE product_id = 'YOUR_PRODUCT_ID';
```

### Issue 4: RLS Policy Blocking
**Fix:** Make sure the RLS policy exists:
```sql
-- Check if policy exists
SELECT * FROM pg_policies WHERE tablename = 'products' AND policyname = 'Anyone can view active products';

-- If missing, create it:
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
USING (status = 'active');
```

## Quick Diagnostic

Run this complete check:

```sql
-- Complete product visibility check
WITH product_check AS (
  SELECT 
    p.id,
    p.title,
    p.handle,
    p.status,
    COUNT(DISTINCT pv.id) as variant_count,
    COUNT(DISTINCT CASE WHEN pv.available = true AND pv.price > 0 AND pv.title != '' THEN pv.id END) as valid_variant_count,
    COUNT(DISTINCT pi.id) as image_count,
    MIN(pv.price) as min_price
  FROM products p
  LEFT JOIN product_variants pv ON p.id = pv.product_id
  LEFT JOIN product_images pi ON p.id = pi.product_id
  WHERE p.id = 'YOUR_PRODUCT_ID'  -- Replace with your product ID
  GROUP BY p.id, p.title, p.handle, p.status
)
SELECT 
  *,
  CASE 
    WHEN status != 'active' THEN '❌ Status must be "active"'
    WHEN variant_count = 0 THEN '❌ No variants'
    WHEN valid_variant_count = 0 THEN '❌ No valid variants (check price, available, title)'
    ELSE '✅ Should be visible - check browser console for errors'
  END as diagnosis
FROM product_check;
```

## Next Steps

1. Run the diagnostic SQL above
2. Check browser console for errors
3. Verify variant data is correct
4. Check RLS policies
5. Share the results if still not working

