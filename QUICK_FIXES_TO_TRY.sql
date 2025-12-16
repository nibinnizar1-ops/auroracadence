-- Quick Fixes to Try
-- Product ID: ed55c4f7-551b-4061-bfdf-be25978497c9

-- Fix 1: Ensure variant is completely valid
UPDATE product_variants 
SET 
  available = true,
  price = 499.00,  -- Your price
  title = COALESCE(NULLIF(title, ''), 'Default'),  -- Ensure title is not empty
  inventory_quantity = COALESCE(inventory_quantity, 10),  -- Set inventory if null
  inventory_policy = COALESCE(inventory_policy, 'deny')
WHERE product_id = 'ed55c4f7-551b-4061-bfdf-be25978497c9';

-- Fix 2: Ensure product is definitely active
UPDATE products 
SET 
  status = 'active',
  handle = 'irani-chain'  -- Ensure handle is correct
WHERE id = 'ed55c4f7-551b-4061-bfdf-be25978497c9';

-- Fix 3: Verify everything is correct
SELECT 
  p.id,
  p.title,
  p.handle,
  p.status,
  pv.id as variant_id,
  pv.title as variant_size,
  pv.price,
  pv.available,
  pv.inventory_quantity,
  pv.inventory_policy,
  CASE 
    WHEN p.status != 'active' THEN '❌ Product not active'
    WHEN pv.id IS NULL THEN '❌ No variant'
    WHEN pv.available = false THEN '❌ Variant not available'
    WHEN pv.price IS NULL OR pv.price = 0 THEN '❌ No price'
    WHEN pv.title IS NULL OR pv.title = '' THEN '❌ No size'
    WHEN pv.inventory_policy = 'deny' AND pv.inventory_quantity = 0 THEN '⚠️ Out of stock'
    ELSE '✅ Everything looks good'
  END as final_check
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.id = 'ed55c4f7-551b-4061-bfdf-be25978497c9';

