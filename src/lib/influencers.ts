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

export async function getActiveInfluencerShowcaseItems(): Promise<InfluencerShowcaseItem[]> {
  try {
    const { data, error } = await supabase
      .from('influencer_showcase_items')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching influencer showcase items:', error);
      return [];
    }

    return (data || []) as InfluencerShowcaseItem[];
  } catch (error) {
    console.error('Error in getActiveInfluencerShowcaseItems:', error);
    return [];
  }
}

