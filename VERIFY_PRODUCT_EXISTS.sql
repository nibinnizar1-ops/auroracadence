-- Verify Your Product Exists and Check All Requirements
-- Run this in Supabase SQL Editor

-- Step 1: List all your products
SELECT 
  id,
  title,
  handle,
  status,
  created_at
FROM products
ORDER BY created_at DESC
LIMIT 10;

-- Step 2: Check a specific product (replace 'YOUR_PRODUCT_ID' with actual ID from Step 1)
SELECT 
  p.id,
  p.title,
  p.handle,
  p.status,
  COUNT(DISTINCT pv.id) as variant_count,
  COUNT(DISTINCT pi.id) as image_count,
  MIN(pv.price) as min_price,
  BOOL_OR(pv.available = true) as has_available_variant,
  BOOL_OR(pv.price > 0) as has_price
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.id = 'YOUR_PRODUCT_ID'  -- Replace with your product ID
GROUP BY p.id, p.title, p.handle, p.status;

-- Step 3: Check variant details
SELECT 
  p.title as product_title,
  p.status as product_status,
  pv.title as variant_size,
  pv.price,
  pv.available,
  pv.inventory_quantity,
  CASE 
    WHEN p.status != 'active' THEN '❌ Product not active'
    WHEN pv.id IS NULL THEN '❌ No variants'
    WHEN pv.price IS NULL OR pv.price = 0 THEN '❌ No price'
    WHEN pv.available = false THEN '❌ Variant not available'
    WHEN pv.title IS NULL OR pv.title = '' THEN '❌ No size'
    ELSE '✅ OK'
  END as status_check
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'YOUR_PRODUCT_ID'  -- Replace with your product ID
ORDER BY pv.position;

-- Step 4: Quick fix - Make product active and ensure variant is valid
-- Uncomment and run if needed:

-- UPDATE products SET status = 'active' WHERE id = 'YOUR_PRODUCT_ID';
-- UPDATE product_variants SET available = true, price = 1000 WHERE product_id = 'YOUR_PRODUCT_ID' AND (price IS NULL OR price = 0);
-- UPDATE product_variants SET title = 'Default' WHERE product_id = 'YOUR_PRODUCT_ID' AND (title IS NULL OR title = '');

