-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  handle TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create category_products table (many-to-many)
CREATE TABLE IF NOT EXISTS public.category_products (
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (category_id, product_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_handle ON public.categories(handle);
CREATE INDEX IF NOT EXISTS idx_category_products_category_id ON public.category_products(category_id);
CREATE INDEX IF NOT EXISTS idx_category_products_product_id ON public.category_products(product_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_products ENABLE ROW LEVEL SECURITY;

-- RLS Policies - allow public read
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view category products" 
ON public.category_products 
FOR SELECT 
USING (true);

