-- PART 6: Create admin policy
CREATE POLICY "Admins can manage social media links" 
ON public.social_media_links 
FOR ALL 
USING (public.is_admin(auth.uid()));

