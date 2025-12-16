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

export async function getActiveStoreLocations(): Promise<StoreLocation[]> {
  try {
    const { data, error } = await supabase
      .from('store_locations')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching store locations:', error);
      return [];
    }

    return (data || []) as StoreLocation[];
  } catch (error) {
    console.error('Error in getActiveStoreLocations:', error);
    return [];
  }
}

