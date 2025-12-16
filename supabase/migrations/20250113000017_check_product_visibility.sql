-- Diagnostic Query: Check Why Products Aren't Showing
-- Run this to see all products and their visibility status

SELECT 
  p.id,
  p.title,
  p.handle,
  p.status,
  CASE 
    WHEN p.status != 'active' THEN '❌ Status is not "active"'
    WHEN COUNT(pv.id) = 0 THEN '❌ No variants'
    WHEN COUNT(CASE WHEN pv.available = true THEN 1 END) = 0 THEN '❌ No available variants'
    WHEN COUNT(CASE WHEN pv.price > 0 THEN 1 END) = 0 THEN '❌ No variants with price > 0'
    ELSE '✅ Should be visible'
  END as visibility_status,
  COUNT(DISTINCT pv.id) as variant_count,
  COUNT(DISTINCT CASE WHEN pv.available = true THEN pv.id END) as available_variant_count,
  COUNT(DISTINCT pi.id) as image_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id, p.title, p.handle, p.status
ORDER BY p.created_at DESC;

-- Quick Fix: Make all draft products active (for testing)
-- Uncomment the line below if you want to activate all draft products:
-- UPDATE products SET status = 'active' WHERE status = 'draft';

