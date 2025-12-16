-- Check Product Variant Data
-- Run this to see why your product might not be showing

-- Replace 'YOUR_PRODUCT_ID' with your actual product ID
-- You can find your product ID in the admin panel URL: /admin/products/[PRODUCT_ID]/edit

SELECT 
  p.id as product_id,
  p.title as product_title,
  p.status,
  p.handle,
  pv.id as variant_id,
  pv.title as variant_size,
  pv.price,
  pv.available,
  pv.inventory_quantity,
  pv.inventory_policy,
  CASE 
    WHEN p.status != 'active' THEN '❌ Product status is not "active"'
    WHEN pv.id IS NULL THEN '❌ Product has NO variants'
    WHEN pv.title IS NULL OR pv.title = '' THEN '❌ Variant has no Size (title is empty)'
    WHEN pv.price IS NULL OR pv.price = 0 THEN '❌ Variant has no price or price is 0'
    WHEN pv.available = false THEN '❌ Variant is not available (available = false)'
    WHEN pv.inventory_policy = 'deny' AND pv.inventory_quantity = 0 THEN '⚠️ Variant is out of stock (inventory_policy = deny, quantity = 0)'
    ELSE '✅ Variant looks good'
  END as issue,
  COUNT(DISTINCT pi.id) as image_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.id = 'YOUR_PRODUCT_ID'  -- REPLACE THIS WITH YOUR PRODUCT ID
GROUP BY p.id, p.title, p.status, p.handle, pv.id, pv.title, pv.price, pv.available, pv.inventory_quantity, pv.inventory_policy
ORDER BY pv.position;

-- Quick Fixes (uncomment and run if needed):

-- Fix 1: Make variant available
-- UPDATE product_variants SET available = true WHERE product_id = 'YOUR_PRODUCT_ID';

-- Fix 2: Set variant price if it's 0
-- UPDATE product_variants SET price = 1000 WHERE product_id = 'YOUR_PRODUCT_ID' AND (price IS NULL OR price = 0);

-- Fix 3: Set variant size (title) if empty
-- UPDATE product_variants SET title = 'Default' WHERE product_id = 'YOUR_PRODUCT_ID' AND (title IS NULL OR title = '');

-- Fix 4: Make product active
-- UPDATE products SET status = 'active' WHERE id = 'YOUR_PRODUCT_ID';

