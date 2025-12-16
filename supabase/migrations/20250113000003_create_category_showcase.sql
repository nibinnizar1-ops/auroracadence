-- Create category_showcase_items table
CREATE TABLE IF NOT EXISTS public.category_showcase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  href TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_category_showcase_position ON public.category_showcase_items(position);
CREATE INDEX IF NOT EXISTS idx_category_showcase_active ON public.category_showcase_items(is_active);

-- Create trigger to update updated_at
CREATE TRIGGER update_category_showcase_updated_at
BEFORE UPDATE ON public.category_showcase_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.category_showcase_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies - allow public read for active items
CREATE POLICY "Anyone can view active category showcase items" 
ON public.category_showcase_items 
FOR SELECT 
USING (is_active = true);

-- RLS Policies - admin only for insert/update/delete
CREATE POLICY "Admins can manage category showcase items" 
ON public.category_showcase_items 
FOR ALL 
USING (public.is_admin(auth.uid()));

