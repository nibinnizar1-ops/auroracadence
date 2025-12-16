-- Migrate existing single category field to product_categories junction table
-- This preserves existing category assignments

-- Insert existing categories into junction table
INSERT INTO public.product_categories (product_id, category_name)
SELECT 
  id as product_id,
  category as category_name
FROM public.products
WHERE category IS NOT NULL 
  AND category != ''
  AND NOT EXISTS (
    SELECT 1 FROM public.product_categories 
    WHERE product_categories.product_id = products.id 
    AND product_categories.category_name = products.category
  );

-- Note: We keep the category field in products table for backward compatibility
-- But new products should use product_categories junction table

