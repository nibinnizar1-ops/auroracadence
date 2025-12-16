-- Create social_media_links table
CREATE TABLE IF NOT EXISTS public.social_media_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_social_media_active ON public.social_media_links(is_active);

-- Create trigger to update updated_at
CREATE TRIGGER update_social_media_updated_at
BEFORE UPDATE ON public.social_media_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.social_media_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies - allow public read for active links
CREATE POLICY "Anyone can view active social media links" 
ON public.social_media_links 
FOR SELECT 
USING (is_active = true);

-- RLS Policies - admin only for insert/update/delete
CREATE POLICY "Admins can manage social media links" 
ON public.social_media_links 
FOR ALL 
USING (public.is_admin(auth.uid()));

-- Insert default social media platforms
INSERT INTO public.social_media_links (platform, url, icon_name, is_active) VALUES
  ('instagram', 'https://www.instagram.com/auroracadence', 'Instagram', true),
  ('facebook', 'https://www.facebook.com/auroracadence', 'Facebook', true),
  ('twitter', 'https://www.twitter.com/auroracadence', 'Twitter', true),
  ('youtube', 'https://www.youtube.com/@auroracadence', 'Youtube', true)
ON CONFLICT (platform) DO NOTHING;

