import { supabase } from "@/integrations/supabase/client";

export interface StoreLocation {
  id: string;
  name: string;
  location: string;
  description: string | null;
  image_url: string;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getAllStoreLocations(): Promise<StoreLocation[]> {
  try {
    // @ts-ignore - store_locations table exists but not in generated types yet
    const { data, error } = await supabase
      .from('store_locations')
      .select('*')
      .order('position', { ascending: true });

    if (error) throw error;
    return (data || []) as unknown as StoreLocation[];
  } catch (error) {
    console.error('Error fetching store locations:', error);
    return [];
  }
}

export async function getStoreLocationById(id: string): Promise<StoreLocation | null> {
  try {
    // @ts-ignore - store_locations table exists but not in generated types yet
    const { data, error } = await supabase
      .from('store_locations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as unknown as StoreLocation;
  } catch (error) {
    return null;
  }
}

export async function createStoreLocation(store: {
  name: string;
  location: string;
  description?: string;
  image_url: string;
  position?: number;
  is_active?: boolean;
}): Promise<{ data: StoreLocation | null; error: Error | null }> {
  try {
    // @ts-ignore - store_locations table exists but not in generated types yet
    const { data, error } = await supabase
      .from('store_locations')
      .insert({
        name: store.name,
        location: store.location,
        description: store.description,
        image_url: store.image_url,
        position: store.position ?? 0,
        is_active: store.is_active ?? true,
      })
      .select()
      .single();

    if (error) return { data: null, error: error as Error };
    return { data: data as StoreLocation, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateStoreLocation(
  id: string,
  updates: Partial<StoreLocation>
): Promise<{ data: StoreLocation | null; error: Error | null }> {
  try {
    // @ts-ignore - store_locations table exists but not in generated types yet
    const { data, error } = await supabase
      .from('store_locations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error as Error };
    return { data: data as StoreLocation, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteStoreLocation(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('store_locations' as any)
      .delete()
      .eq('id', id);

    return { error: error || null };
  } catch (error) {
    return { error: error as Error };
  }
}

export async function uploadStoreImage(file: File): Promise<{ url: string | null; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `stores/${Date.now()}.${fileExt}`;

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

