-- PART 5: Create public read policy
CREATE POLICY "Anyone can view active social media links" 
ON public.social_media_links 
FOR SELECT 
USING (is_active = true);

