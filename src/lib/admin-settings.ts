import { supabase } from "@/integrations/supabase/client";

export interface ProductType {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Product Types
export async function getAllProductTypes(): Promise<ProductType[]> {
  try {
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []) as ProductType[];
  } catch (error) {
    console.error('Error fetching product types:', error);
    return [];
  }
}

export async function getActiveProductTypes(): Promise<ProductType[]> {
  try {
    const { data, error } = await supabase
      .from('product_types')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []) as ProductType[];
  } catch (error) {
    console.error('Error fetching active product types:', error);
    return [];
  }
}

export async function createProductType(type: {
  name: string;
  description?: string;
  is_active?: boolean;
}): Promise<{ data: ProductType | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('product_types')
      .insert({
        name: type.name,
        description: type.description,
        is_active: type.is_active ?? true,
      })
      .select()
      .single();

    if (error) return { data: null, error: error as Error };
    return { data: data as ProductType, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateProductType(
  id: string,
  updates: Partial<ProductType>
): Promise<{ data: ProductType | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('product_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error as Error };
    return { data: data as ProductType, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteProductType(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('product_types')
      .delete()
      .eq('id', id);

    return { error: error || null };
  } catch (error) {
    return { error: error as Error };
  }
}

// Categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories_management')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []) as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getActiveCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories_management')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return (data || []) as Category[];
  } catch (error) {
    console.error('Error fetching active categories:', error);
    return [];
  }
}

export async function createCategory(category: {
  name: string;
  description?: string;
  is_active?: boolean;
}): Promise<{ data: Category | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('categories_management')
      .insert({
        name: category.name,
        description: category.description,
        is_active: category.is_active ?? true,
      })
      .select()
      .single();

    if (error) return { data: null, error: error as Error };
    return { data: data as Category, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<{ data: Category | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('categories_management')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return { data: null, error: error as Error };
    return { data: data as Category, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

export async function deleteCategory(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('categories_management')
      .delete()
      .eq('id', id);

    return { error: error || null };
  } catch (error) {
    return { error: error as Error };
  }
}

