-- Create luxury_mood_categories table
CREATE TABLE IF NOT EXISTS public.luxury_mood_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  href TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_luxury_moods_position ON public.luxury_mood_categories(position);
CREATE INDEX IF NOT EXISTS idx_luxury_moods_active ON public.luxury_mood_categories(is_active);

-- Create trigger to update updated_at
CREATE TRIGGER update_luxury_moods_updated_at
BEFORE UPDATE ON public.luxury_mood_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.luxury_mood_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies - allow public read for active categories
CREATE POLICY "Anyone can view active luxury mood categories" 
ON public.luxury_mood_categories 
FOR SELECT 
USING (is_active = true);

-- RLS Policies - admin only for insert/update/delete
CREATE POLICY "Admins can manage luxury mood categories" 
ON public.luxury_mood_categories 
FOR ALL 
USING (public.is_admin(auth.uid()));

