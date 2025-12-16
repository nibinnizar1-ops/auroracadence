import { supabase } from "@/integrations/supabase/client";

export interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
  icon_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAllSocialMediaLinks(): Promise<SocialMediaLink[]> {
  try {
    const { data, error } = await supabase
      .from('social_media_links')
      .select('*')
      .order('platform', { ascending: true });

    if (error) throw error;
    return (data || []) as SocialMediaLink[];
  } catch (error) {
    console.error('Error fetching social media links:', error);
    return [];
  }
}

export async function getSocialMediaLinkByPlatform(platform: string): Promise<SocialMediaLink | null> {
  try {
    const { data, error } = await supabase
      .from('social_media_links')
      .select('*')
      .eq('platform', platform)
      .single();

    if (error) return null;
    return data as SocialMediaLink;
  } catch (error) {
    return null;
  }
}

export async function updateSocialMediaLink(
  id: string,
  updates: Partial<SocialMediaLink>
): Promise<{ data: SocialMediaLink | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('social_media_links')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: data as SocialMediaLink, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

