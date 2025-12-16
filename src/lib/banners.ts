import { supabase } from "@/integrations/supabase/client";

export interface Banner {
  id: string;
  name: string;
  section: 'hero' | 'collection' | 'luxury';
  image_url: string;
  alt_text: string | null;
  link_url: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Get active banners by section
 */
export async function getBannersBySection(section: 'hero' | 'collection' | 'luxury'): Promise<Banner[]> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('section', section)
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
      return [];
    }

    return (data || []) as Banner[];
  } catch (error) {
    console.error('Error in getBannersBySection:', error);
    return [];
  }
}

/**
 * Get all active hero banners (for carousel)
 */
export async function getHeroBanners(): Promise<Banner[]> {
  return getBannersBySection('hero');
}

/**
 * Get active collection banner
 */
export async function getCollectionBanner(): Promise<Banner | null> {
  const banners = await getBannersBySection('collection');
  return banners.length > 0 ? banners[0] : null;
}

/**
 * Get active luxury banner
 */
export async function getLuxuryBanner(): Promise<Banner | null> {
  const banners = await getBannersBySection('luxury');
  return banners.length > 0 ? banners[0] : null;
}

