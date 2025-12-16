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

export async function getActiveSocialMediaLinks(): Promise<SocialMediaLink[]> {
  try {
    const { data, error } = await supabase
      .from('social_media_links')
      .select('*')
      .eq('is_active', true)
      .order('platform', { ascending: true });

    if (error) {
      console.error('Error fetching social media links:', error);
      return [];
    }

    return (data || []) as SocialMediaLink[];
  } catch (error) {
    console.error('Error in getActiveSocialMediaLinks:', error);
    return [];
  }
}

