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

export async function getActiveGiftGuideItems(): Promise<GiftGuideItem[]> {
  try {
    const { data, error } = await supabase
      .from('gift_guide_items')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching gift guide items:', error);
      return [];
    }

    return (data || []) as GiftGuideItem[];
  } catch (error) {
    console.error('Error in getActiveGiftGuideItems:', error);
    return [];
  }
}

