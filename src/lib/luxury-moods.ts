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

export async function getActiveLuxuryMoodCategories(): Promise<LuxuryMoodCategory[]> {
  try {
    const { data, error } = await supabase
      .from('luxury_mood_categories')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching luxury mood categories:', error);
      return [];
    }

    return (data || []) as LuxuryMoodCategory[];
  } catch (error) {
    console.error('Error in getActiveLuxuryMoodCategories:', error);
    return [];
  }
}

