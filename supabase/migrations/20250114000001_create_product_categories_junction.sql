-- Create product_categories junction table for many-to-many relationship
-- This allows products to have multiple categories

CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, category_name)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_categories_product_id ON public.product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category_name ON public.product_categories(category_name);

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies - allow public read for active products
CREATE POLICY "Anyone can view categories of active products" 
ON public.product_categories 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.products 
  WHERE products.id = product_categories.product_id 
  AND products.status = 'active'
));

-- RLS Policies - admin write
CREATE POLICY "Admins can manage product categories" 
ON public.product_categories 
FOR ALL 
TO authenticated
USING (public.is_admin(auth.uid()) = true)
WITH CHECK (public.is_admin(auth.uid()) = true);

-- Add comment
COMMENT ON TABLE public.product_categories IS 'Junction table for many-to-many relationship between products and categories';
COMMENT ON COLUMN public.product_categories.category_name IS 'Category name (e.g., "Office Wear", "Necklaces", etc.)';

