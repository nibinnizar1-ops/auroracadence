-- Complete Product Visibility Diagnostic
-- Run this in Supabase SQL Editor to check why your product isn't showing

-- Replace 'YOUR_PRODUCT_ID' with your actual product ID
-- Find it in admin panel URL: /admin/products/[ID]/edit

WITH product_analysis AS (
  SELECT 
    p.id,
    p.title,
    p.handle,
    p.status,
    COUNT(DISTINCT pv.id) as total_variants,
    COUNT(DISTINCT CASE 
      WHEN pv.available = true 
        AND pv.price > 0 
        AND pv.title IS NOT NULL 
        AND pv.title != '' 
      THEN pv.id 
    END) as valid_variants,
    COUNT(DISTINCT pi.id) as image_count,
    MIN(CASE WHEN pv.available = true AND pv.price > 0 THEN pv.price END) as min_price
  FROM products p
  LEFT JOIN product_variants pv ON p.id = pv.product_id
  LEFT JOIN product_images pi ON p.id = pi.product_id
  WHERE p.id = 'YOUR_PRODUCT_ID'  -- REPLACE WITH YOUR PRODUCT ID
  GROUP BY p.id, p.title, p.handle, p.status
)
SELECT 
  *,
  CASE 
    WHEN status != 'active' THEN '❌ ISSUE: Product status is "' || status || '" (must be "active")'
    WHEN total_variants = 0 THEN '❌ ISSUE: Product has NO variants'
    WHEN valid_variants = 0 THEN '❌ ISSUE: Product has variants but NONE are valid. Check: available=true, price>0, title not empty'
    ELSE '✅ Product should be visible! Check browser console for other errors.'
  END as diagnosis
FROM product_analysis;

-- Detailed Variant Check
SELECT 
  p.title as product,
  p.status,
  pv.title as variant_size,
  pv.price,
  pv.available,
  pv.inventory_quantity,
  CASE 
    WHEN pv.available = false THEN '❌ available = false'
    WHEN pv.price IS NULL OR pv.price = 0 THEN '❌ price is NULL or 0'
    WHEN pv.title IS NULL OR pv.title = '' THEN '❌ title (size) is empty'
    ELSE '✅ Variant is valid'
  END as variant_issue
FROM products p
JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'YOUR_PRODUCT_ID'  -- REPLACE WITH YOUR PRODUCT ID
ORDER BY pv.position;

-- Quick Fixes (uncomment and run if needed):

-- Fix 1: Make all variants available
-- UPDATE product_variants SET available = true WHERE product_id = 'YOUR_PRODUCT_ID';

-- Fix 2: Set price if 0 or NULL
-- UPDATE product_variants SET price = 1000 WHERE product_id = 'YOUR_PRODUCT_ID' AND (price IS NULL OR price = 0);

-- Fix 3: Set size (title) if empty
-- UPDATE product_variants SET title = 'Default' WHERE product_id = 'YOUR_PRODUCT_ID' AND (title IS NULL OR title = '');

-- Fix 4: Make product active
-- UPDATE products SET status = 'active' WHERE id = 'YOUR_PRODUCT_ID';

