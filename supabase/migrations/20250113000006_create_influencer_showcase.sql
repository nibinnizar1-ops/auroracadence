-- Create influencer_showcase_items table
CREATE TABLE IF NOT EXISTS public.influencer_showcase_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  quote TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_description TEXT,
  image_url TEXT NOT NULL,
  instagram_reel_url TEXT,
  product_price DECIMAL(10,2),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_influencer_showcase_position ON public.influencer_showcase_items(position);
CREATE INDEX IF NOT EXISTS idx_influencer_showcase_active ON public.influencer_showcase_items(is_active);

-- Create trigger to update updated_at
CREATE TRIGGER update_influencer_showcase_updated_at
BEFORE UPDATE ON public.influencer_showcase_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.influencer_showcase_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies - allow public read for active items
CREATE POLICY "Anyone can view active influencer showcase items" 
ON public.influencer_showcase_items 
FOR SELECT 
USING (is_active = true);

-- RLS Policies - admin only for insert/update/delete
CREATE POLICY "Admins can manage influencer showcase items" 
ON public.influencer_showcase_items 
FOR ALL 
USING (public.is_admin(auth.uid()));

