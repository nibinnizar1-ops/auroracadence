-- PART 3: Create trigger
CREATE TRIGGER update_social_media_updated_at
BEFORE UPDATE ON public.social_media_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

