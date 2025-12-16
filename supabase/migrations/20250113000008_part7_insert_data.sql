-- PART 7: Insert default social media platforms
INSERT INTO public.social_media_links (platform, url, icon_name, is_active) VALUES
  ('instagram', 'https://www.instagram.com/auroracadence', 'Instagram', true),
  ('facebook', 'https://www.facebook.com/auroracadence', 'Facebook', true),
  ('twitter', 'https://www.twitter.com/auroracadence', 'Twitter', true),
  ('youtube', 'https://www.youtube.com/@auroracadence', 'Youtube', true)
ON CONFLICT (platform) DO NOTHING;

