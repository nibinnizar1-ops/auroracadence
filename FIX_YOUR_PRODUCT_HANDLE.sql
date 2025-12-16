-- Fix Handle for Your Product
-- Product ID: ed55c4f7-551b-4061-bfdf-be25978497c9
-- Current handle: "irani Chain" (has space)
-- Will change to: "irani-chain" (hyphen)

-- Fix the handle
UPDATE products 
SET handle = 'irani-chain'
WHERE id = 'ed55c4f7-551b-4061-bfdf-be25978497c9';

-- Verify the fix
SELECT 
  id,
  title,
  handle,
  status,
  CASE 
    WHEN handle LIKE '% %' THEN '❌ Still has spaces'
    ELSE '✅ Fixed!'
  END as handle_status
FROM products
WHERE id = 'ed55c4f7-551b-4061-bfdf-be25978497c9';

