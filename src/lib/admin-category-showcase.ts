import { supabase } from "@/integrations/supabase/client";

export interface CategoryShowcaseItem {
  id: string;
  name: string;
  image_url: string;
  href: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAllCategoryShowcaseItems(): Promise<CategoryShowcaseItem[]> {
  try {
    const { data, error } = await supabase
      .from('category_showcase_items')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;
    return (data || []) as CategoryShowcaseItem[];
  } catch (error) {
    console.error('Error fetching category showcase items:', error);
    return [];
  }
}

export async function getCategoryShowcaseItemById(id: string): Promise<CategoryShowcaseItem | null> {
  try {
    const { data, error } = await supabase
      .from('category_showcase_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as CategoryShowcaseItem;
  } catch (error) {
    return null;
  }
}

export async function createCategoryShowcaseItem(item: {
  name: string;
  image_url: string;
  href: string;
  position?: number;
  is_active?: boolean;
}): Promise<{ data: CategoryShowcaseItem | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('category_showcase_items')
      .insert({
        ...item,
        position: item.position ?? 0,
        is_active: item.is_active ?? true,
      })
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: data as CategoryShowcaseItem, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateCategoryShowcaseItem(
  id: string,
  updates: Partial<CategoryShowcaseItem>
): Promise<{ data: CategoryShowcaseItem | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('category_showcase_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error };
    return { data: data as CategoryShowcaseItem, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteCategoryShowcaseItem(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('category_showcase_items')
      .delete()
      .eq('id', id);

    return { error: error || null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function uploadCategoryShowcaseImage(file: File): Promise<{ url: string | null; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `category-showcase/${Date.now()}.${fileExt}`;

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

