-- Deep Diagnostic - Check Everything
-- Product ID: ed55c4f7-551b-4061-bfdf-be25978497c9

-- 1. Check product basic info
SELECT 
  id,
  title,
  handle,
  status,
  featured,
  category,
  created_at
FROM products
WHERE id = 'ed55c4f7-551b-4061-bfdf-be25978497c9';

-- 2. Check variant details (VERY IMPORTANT)
SELECT 
  pv.id,
  pv.title as variant_size,
  pv.price,
  pv.available,
  pv.inventory_quantity,
  pv.inventory_policy,
  pv.position,
  CASE 
    WHEN pv.available = false THEN '❌ available = false'
    WHEN pv.price IS NULL OR pv.price = 0 THEN '❌ price is 0 or NULL'
    WHEN pv.title IS NULL OR pv.title = '' THEN '❌ title (size) is empty'
    WHEN pv.inventory_policy = 'deny' AND pv.inventory_quantity = 0 THEN '⚠️ Out of stock (deny policy)'
    ELSE '✅ Variant is valid'
  END as variant_issue
FROM product_variants pv
WHERE pv.product_id = 'ed55c4f7-551b-4061-bfdf-be25978497c9'
ORDER BY pv.position;

-- 3. Check product images
SELECT 
  COUNT(*) as image_count,
  STRING_AGG(url, ', ') as image_urls
FROM product_images
WHERE product_id = 'ed55c4f7-551b-4061-bfdf-be25978497c9';

-- 4. Test if product would be returned by frontend query
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
  MIN(CASE WHEN pv.available = true AND pv.price > 0 THEN pv.price END) as min_price
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'ed55c4f7-551b-4061-bfdf-be25978497c9'
  AND p.status = 'active'  -- Frontend filters by this
GROUP BY p.id, p.title, p.handle, p.status
HAVING COUNT(DISTINCT CASE 
  WHEN pv.available = true 
    AND pv.price > 0 
    AND pv.title IS NOT NULL 
    AND pv.title != '' 
  THEN pv.id 
END) > 0;  -- Frontend requires at least one valid variant

