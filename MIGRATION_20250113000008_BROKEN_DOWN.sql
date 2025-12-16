-- ============================================
-- Migration 20250113000008 - Social Media Links
-- BROKEN DOWN INTO SMALLER PARTS
-- ============================================

-- PART 1: Create Table
-- Run this first
CREATE TABLE IF NOT EXISTS public.social_media_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- PART 2: Create Index
-- Run this second
CREATE INDEX IF NOT EXISTS idx_social_media_active ON public.social_media_links(is_active);

-- PART 3: Create Trigger
-- Run this third
CREATE TRIGGER update_social_media_updated_at
BEFORE UPDATE ON public.social_media_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- PART 4: Enable RLS
-- Run this fourth
ALTER TABLE public.social_media_links ENABLE ROW LEVEL SECURITY;

-- PART 5: Create Public Read Policy
-- Run this fifth
CREATE POLICY "Anyone can view active social media links" 
ON public.social_media_links 
FOR SELECT 
USING (is_active = true);

-- PART 6: Create Admin Policy
-- Run this sixth
CREATE POLICY "Admins can manage social media links" 
ON public.social_media_links 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- PART 7: Insert Default Data
-- Run this last
INSERT INTO public.social_media_links (platform, url, icon_name, is_active) VALUES
  ('instagram', 'https://www.instagram.com/auroracadence', 'Instagram', true),
  ('facebook', 'https://www.facebook.com/auroracadence', 'Facebook', true),
  ('twitter', 'https://www.twitter.com/auroracadence', 'Twitter', true),
  ('youtube', 'https://www.youtube.com/@auroracadence', 'Youtube', true)
ON CONFLICT (platform) DO NOTHING;

