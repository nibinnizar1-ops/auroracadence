import { supabase } from "@/integrations/supabase/client";

export interface InfluencerShowcaseItem {
  id: string;
  name: string;
  quote: string;
  product_name: string;
  product_description: string | null;
  image_url: string;
  instagram_reel_url: string | null;
  product_price: number | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAllInfluencerShowcaseItems(): Promise<InfluencerShowcaseItem[]> {
  try {
    const { data, error } = await supabase
      .from('influencer_showcase_items')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;
    return (data || []) as InfluencerShowcaseItem[];
  } catch (error) {
    console.error('Error fetching influencer showcase items:', error);
    return [];
  }
}

export async function getInfluencerShowcaseItemById(id: string): Promise<InfluencerShowcaseItem | null> {
  try {
    const { data, error } = await supabase
      .from('influencer_showcase_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as InfluencerShowcaseItem;
  } catch (error) {
    return null;
  }
}

export async function createInfluencerShowcaseItem(item: {
  name: string;
  quote: string;
  product_name: string;
  product_description?: string;
  image_url: string;
  instagram_reel_url?: string;
  product_price?: number;
  position?: number;
  is_active?: boolean;
}): Promise<{ data: InfluencerShowcaseItem | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('influencer_showcase_items')
      .insert({
        ...item,
        position: item.position ?? 0,
        is_active: item.is_active ?? true,
      })
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: data as InfluencerShowcaseItem, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateInfluencerShowcaseItem(
  id: string,
  updates: Partial<InfluencerShowcaseItem>
): Promise<{ data: InfluencerShowcaseItem | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('influencer_showcase_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: data as InfluencerShowcaseItem, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteInfluencerShowcaseItem(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('influencer_showcase_items')
      .delete()
      .eq('id', id);

    return { error: error || null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function uploadInfluencerImage(file: File): Promise<{ url: string | null; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `influencers/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
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

