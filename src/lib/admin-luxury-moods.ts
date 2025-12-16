import { supabase } from "@/integrations/supabase/client";

export interface LuxuryMoodCategory {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  href: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAllLuxuryMoodCategories(): Promise<LuxuryMoodCategory[]> {
  try {
    const { data, error } = await supabase
      .from('luxury_mood_categories')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;
    return (data || []) as LuxuryMoodCategory[];
  } catch (error) {
    console.error('Error fetching luxury mood categories:', error);
    return [];
  }
}

export async function getLuxuryMoodCategoryById(id: string): Promise<LuxuryMoodCategory | null> {
  try {
    const { data, error } = await supabase
      .from('luxury_mood_categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as LuxuryMoodCategory;
  } catch (error) {
    return null;
  }
}

export async function createLuxuryMoodCategory(category: {
  name: string;
  description?: string;
  image_url: string;
  href: string;
  position?: number;
  is_active?: boolean;
}): Promise<{ data: LuxuryMoodCategory | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('luxury_mood_categories')
      .insert({
        ...category,
        position: category.position ?? 0,
        is_active: category.is_active ?? true,
      })
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: data as LuxuryMoodCategory, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateLuxuryMoodCategory(
  id: string,
  updates: Partial<LuxuryMoodCategory>
): Promise<{ data: LuxuryMoodCategory | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('luxury_mood_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: data as LuxuryMoodCategory, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteLuxuryMoodCategory(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('luxury_mood_categories')
      .delete()
      .eq('id', id);

    return { error: error || null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function uploadLuxuryMoodImage(file: File): Promise<{ url: string | null; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `luxury-moods/${Date.now()}.${fileExt}`;

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

