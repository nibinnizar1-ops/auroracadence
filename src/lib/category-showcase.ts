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

export async function getActiveCategoryShowcaseItems(): Promise<CategoryShowcaseItem[]> {
  try {
    const { data, error } = await supabase
      .from('category_showcase_items')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching category showcase items:', error);
      return [];
    }

    return (data || []) as CategoryShowcaseItem[];
  } catch (error) {
    console.error('Error in getActiveCategoryShowcaseItems:', error);
    return [];
  }
}

