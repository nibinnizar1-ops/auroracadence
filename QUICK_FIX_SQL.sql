-- Quick Fix SQL Script
-- Replace 'YOUR_PRODUCT_ID' with your actual product ID from the admin panel

-- Step 1: Find your product ID
SELECT id, title, handle, status FROM products ORDER BY created_at DESC LIMIT 5;

-- Step 2: Run this with your product ID to check everything
SELECT 
  p.id,
  p.title,
  p.handle,
  p.status,
  COUNT(DISTINCT pv.id) as variant_count,
  COUNT(DISTINCT CASE 
    WHEN pv.available = true 
      AND pv.price > 0 
      AND pv.title IS NOT NULL 
      AND pv.title != '' 
    THEN pv.id 
  END) as valid_variant_count,
  MIN(CASE WHEN pv.available = true AND pv.price > 0 THEN pv.price END) as min_price,
  CASE 
    WHEN p.status != 'active' THEN '❌ Status not active'
    WHEN COUNT(DISTINCT pv.id) = 0 THEN '❌ No variants'
    WHEN COUNT(DISTINCT CASE 
      WHEN pv.available = true 
        AND pv.price > 0 
        AND pv.title IS NOT NULL 
        AND pv.title != '' 
      THEN pv.id 
    END) = 0 THEN '❌ No valid variants'
    WHEN p.handle LIKE '% %' THEN '⚠️ Handle has spaces'
    ELSE '✅ Should be visible'
  END as diagnosis
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'YOUR_PRODUCT_ID'  -- REPLACE THIS
GROUP BY p.id, p.title, p.handle, p.status;

-- Step 3: Fix all issues at once (uncomment and run)
/*
-- Make product active
UPDATE products SET status = 'active' WHERE id = 'YOUR_PRODUCT_ID';

-- Fix handle (spaces to hyphens)
UPDATE products 
SET handle = LOWER(REPLACE(REPLACE(REPLACE(title, ' ', '-'), '--', '-'), '---', '-'))
WHERE id = 'YOUR_PRODUCT_ID';

-- Fix variant (set price, available, title)
UPDATE product_variants 
SET 
  available = true,
  price = 1000,  -- Change to your actual price
  title = COALESCE(NULLIF(title, ''), 'Default')  -- Change 'Default' to your size
WHERE product_id = 'YOUR_PRODUCT_ID';
*/

