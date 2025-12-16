import { supabase } from "@/integrations/supabase/client";

export interface GiftGuideItem {
  id: string;
  name: string;
  label: string;
  image_url: string;
  href: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAllGiftGuideItems(): Promise<GiftGuideItem[]> {
  try {
    const { data, error } = await supabase
      .from('gift_guide_items')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;
    return (data || []) as GiftGuideItem[];
  } catch (error) {
    console.error('Error fetching gift guide items:', error);
    return [];
  }
}

export async function getGiftGuideItemById(id: string): Promise<GiftGuideItem | null> {
  try {
    const { data, error } = await supabase
      .from('gift_guide_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as GiftGuideItem;
  } catch (error) {
    return null;
  }
}

export async function createGiftGuideItem(item: {
  name: string;
  label: string;
  image_url: string;
  href: string;
  position?: number;
  is_active?: boolean;
}): Promise<{ data: GiftGuideItem | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('gift_guide_items')
      .insert({
        ...item,
        position: item.position ?? 0,
        is_active: item.is_active ?? true,
      })
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: data as GiftGuideItem, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateGiftGuideItem(
  id: string,
  updates: Partial<GiftGuideItem>
): Promise<{ data: GiftGuideItem | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('gift_guide_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: data as GiftGuideItem, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteGiftGuideItem(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('gift_guide_items')
      .delete()
      .eq('id', id);

    return { error: error || null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function uploadGiftGuideImage(file: File): Promise<{ url: string | null; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `gift-guide/${Date.now()}.${fileExt}`;

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

