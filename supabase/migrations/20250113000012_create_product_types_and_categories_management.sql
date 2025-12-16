-- Create product_types table for managing product types
CREATE TABLE IF NOT EXISTS public.product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create categories_management table for managing categories
CREATE TABLE IF NOT EXISTS public.categories_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_types_name ON public.product_types(name);
CREATE INDEX IF NOT EXISTS idx_product_types_active ON public.product_types(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_management_name ON public.categories_management(name);
CREATE INDEX IF NOT EXISTS idx_categories_management_active ON public.categories_management(is_active);

-- Create triggers to update updated_at
CREATE TRIGGER update_product_types_updated_at
BEFORE UPDATE ON public.product_types
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_categories_management_updated_at
BEFORE UPDATE ON public.categories_management
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories_management ENABLE ROW LEVEL SECURITY;

-- RLS Policies - allow public read for active items
CREATE POLICY "Anyone can view active product types" 
ON public.product_types 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view active categories" 
ON public.categories_management 
FOR SELECT 
USING (is_active = true);

-- RLS Policies - admin only for insert/update/delete
CREATE POLICY "Admins can manage product types" 
ON public.product_types 
FOR ALL 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage categories" 
ON public.categories_management 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- Insert default product types
INSERT INTO public.product_types (name, description) VALUES
  ('Necklace', 'Necklaces and pendants'),
  ('Earrings', 'Earrings of all types'),
  ('Ring', 'Rings and bands'),
  ('Bracelet', 'Bracelets and bangles'),
  ('Anklet', 'Anklets'),
  ('Brooch', 'Brooches and pins')
ON CONFLICT (name) DO NOTHING;

-- Insert default categories
INSERT INTO public.categories_management (name, description) VALUES
  ('Office Wear', 'Professional and elegant jewelry'),
  ('Daily Wear', 'Comfortable and chic everyday jewelry'),
  ('Party Wear', 'Bold and glamorous party jewelry'),
  ('Date Night', 'Romantic and sophisticated jewelry'),
  ('Wedding Wear', 'Timeless and luxurious wedding jewelry'),
  ('New Arrivals', 'Latest product arrivals'),
  ('Bestseller', 'Best selling products'),
  ('Necklaces', 'Necklace category'),
  ('Rings', 'Ring category'),
  ('Earrings', 'Earring category'),
  ('Bracelets', 'Bracelet category')
ON CONFLICT (name) DO NOTHING;

