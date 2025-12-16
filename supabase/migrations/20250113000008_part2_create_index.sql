-- PART 2: Create index
CREATE INDEX IF NOT EXISTS idx_social_media_active ON public.social_media_links(is_active);

