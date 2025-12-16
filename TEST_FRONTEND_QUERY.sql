-- Test if Frontend Query Would Return Your Product
-- This simulates what the frontend getProducts() function does

-- Simulate the exact frontend query
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
  -- Check each validation step
  BOOL_OR(pv.available = true) as has_available_variant,
  BOOL_OR(pv.price > 0) as has_price,
  BOOL_OR(pv.title IS NOT NULL AND pv.title != '') as has_title,
  CASE 
    WHEN p.status != 'active' THEN '❌ Filtered: Status not active'
    WHEN COUNT(DISTINCT pv.id) = 0 THEN '❌ Filtered: No variants'
    WHEN COUNT(DISTINCT CASE 
      WHEN pv.available = true 
        AND pv.price > 0 
        AND pv.title IS NOT NULL 
        AND pv.title != '' 
      THEN pv.id 
    END) = 0 THEN '❌ Filtered: No valid variants'
    ELSE '✅ Should be returned by frontend query'
  END as frontend_status
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'ed55c4f7-551b-4061-bfdf-be25978497c9'
  AND p.status = 'active'  -- Frontend filters by this
GROUP BY p.id, p.title, p.handle, p.status;

-- Also check all active products to see if yours is in the list
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
  END) as valid_variant_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.status = 'active'
GROUP BY p.id, p.title, p.handle, p.status
HAVING COUNT(DISTINCT CASE 
  WHEN pv.available = true 
    AND pv.price > 0 
    AND pv.title IS NOT NULL 
    AND pv.title != '' 
  THEN pv.id 
END) > 0
ORDER BY p.created_at DESC
LIMIT 20;

