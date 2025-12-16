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
 * Get all banners for admin
 */
export async function getAllBannersForAdmin(filters?: {
  section?: 'hero' | 'collection' | 'luxury';
  is_active?: boolean;
}): Promise<Banner[]> {
  try {
    let query = supabase
      .from('banners')
      .select('*')
      .order('section', { ascending: true })
      .order('position', { ascending: true });

    if (filters?.section) {
      query = query.eq('section', filters.section);
    }

    if (filters?.is_active !== undefined) {
      query = query.eq('is_active', filters.is_active);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }

    return (data || []) as Banner[];
  } catch (error) {
    console.error('Error in getAllBannersForAdmin:', error);
    return [];
  }
}

/**
 * Get banner by ID
 */
export async function getBannerById(bannerId: string): Promise<Banner | null> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('id', bannerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching banner:', error);
      throw error;
    }

    return data as Banner;
  } catch (error) {
    console.error('Error in getBannerById:', error);
    return null;
  }
}

/**
 * Create a new banner
 */
export async function createBanner(bannerData: {
  name: string;
  section: 'hero' | 'collection' | 'luxury';
  image_url: string;
  alt_text?: string;
  link_url?: string;
  position?: number;
  is_active?: boolean;
}): Promise<{ data: Banner | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .insert({
        ...bannerData,
        position: bannerData.position ?? 0,
        is_active: bannerData.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as Banner, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Update a banner
 */
export async function updateBanner(
  bannerId: string,
  updates: Partial<Banner>
): Promise<{ data: Banner | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('banners')
      .update(updates)
      .eq('id', bannerId)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as Banner, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Delete a banner
 */
export async function deleteBanner(bannerId: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', bannerId);

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Upload banner image to Supabase Storage
 */
export async function uploadBannerImage(file: File): Promise<{ url: string | null; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `banners/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      // Return a more descriptive error
      const errorMessage = error.message || JSON.stringify(error);
      return { url: null, error: new Error(errorMessage) };
    }

    if (!data?.path) {
      return { url: null, error: new Error('Upload succeeded but no path returned') };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected upload error:', error);
    return { url: null, error: error as Error };
  }
}

