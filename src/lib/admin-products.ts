import { supabase } from "@/integrations/supabase/client";
import { Product, ProductVariant, ProductImage, ProductOption } from "./products";

/**
 * Get all products for admin (including draft/archived)
 */
export async function getAllProductsForAdmin(filters?: {
  status?: 'active' | 'draft' | 'archived';
  search?: string;
  category?: string;
}): Promise<Product[]> {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllProductsForAdmin:', error);
    return [];
  }
}

/**
 * Get product categories
 */
export async function getProductCategories(productId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('category_name')
      .eq('product_id', productId);

    if (error) {
      console.error('Error fetching product categories:', error);
      return [];
    }

    return data?.map(item => item.category_name) || [];
  } catch (error) {
    console.error('Error in getProductCategories:', error);
    return [];
  }
}

/**
 * Set product categories (replaces all existing categories)
 */
export async function setProductCategories(
  productId: string,
  categories: string[]
): Promise<{ error: Error | null }> {
  try {
    // Delete existing categories
    const { error: deleteError } = await supabase
      .from('product_categories')
      .delete()
      .eq('product_id', productId);

    if (deleteError) {
      return { error: deleteError };
    }

    // Insert new categories (if any)
    if (categories.length > 0) {
      const categoryData = categories.map(categoryName => ({
        product_id: productId,
        category_name: categoryName,
      }));

      const { error: insertError } = await supabase
        .from('product_categories')
        .insert(categoryData);

      if (insertError) {
        return { error: insertError };
      }
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Add a single category to a product
 */
export async function addProductCategory(
  productId: string,
  categoryName: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('product_categories')
      .insert({
        product_id: productId,
        category_name: categoryName,
      });

    if (error) {
      // Ignore duplicate key errors (category already exists)
      if (error.code !== '23505') {
        return { error };
      }
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Remove a single category from a product
 */
export async function removeProductCategory(
  productId: string,
  categoryName: string
): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('product_categories')
      .delete()
      .eq('product_id', productId)
      .eq('category_name', categoryName);

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Get product by ID for admin
 */
export async function getProductByIdForAdmin(productId: string): Promise<{
  product: Product;
  variants: ProductVariant[];
  images: ProductImage[];
  options: ProductOption[];
  categories: string[];
} | null> {
  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      return null;
    }

    const { data: variants } = await supabase
      .from('product_variants')
      .select('*')
      .eq('product_id', productId)
      .order('position', { ascending: true });

    const { data: images } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('position', { ascending: true });

    const { data: options } = await supabase
      .from('product_options')
      .select('*')
      .in('variant_id', (variants || []).map(v => v.id));

    return {
      product: product as Product,
      variants: (variants || []) as ProductVariant[],
      images: (images || []) as ProductImage[],
      options: (options || []) as ProductOption[],
    };
  } catch (error) {
    console.error('Error in getProductByIdForAdmin:', error);
    return null;
  }
}

/**
 * Create a new product
 */
export async function createProduct(productData: {
  title: string;
  description?: string;
  handle: string;
  product_type?: string;
  status?: 'active' | 'draft' | 'archived';
  featured?: boolean;
  category?: string;
  categories?: string[]; // New: multiple categories
  tags?: string[];
  meta_title?: string;
  meta_description?: string;
  discount_type?: 'percentage' | 'fixed' | null;
  discount_value?: number | null;
  discount_valid_from?: string | null;
  discount_valid_until?: string | null;
  eligible_for_coupons?: boolean;
  default_coupon_id?: string | null;
}): Promise<{ data: Product | null; error: Error | null }> {
  try {
    // Build insert data, conditionally include default_coupon_id if provided
    const insertData: any = {
      ...productData,
      tags: productData.tags || [],
      status: productData.status || 'draft',
      featured: productData.featured || false,
      eligible_for_coupons: productData.eligible_for_coupons !== undefined ? productData.eligible_for_coupons : true,
    };
    
    // Remove categories from insertData (we'll handle it separately)
    delete insertData.categories;
    
    // Only include default_coupon_id if it's provided (column might not exist yet)
    if (productData.default_coupon_id !== undefined) {
      insertData.default_coupon_id = productData.default_coupon_id;
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    // Set categories in junction table if provided
    if (productData.categories && productData.categories.length > 0) {
      const categoryError = await setProductCategories(data.id, productData.categories);
      if (categoryError.error) {
        console.error('Error setting product categories:', categoryError.error);
        // Don't fail the whole operation, just log the error
      }
    } else if (productData.category) {
      // Fallback: if old category field is used, migrate it
      const categoryError = await setProductCategories(data.id, [productData.category]);
      if (categoryError.error) {
        console.error('Error setting product category:', categoryError.error);
      }
    }

    return { data: data as Product, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Update a product
 */
export async function updateProduct(
  productId: string,
  updates: Partial<Product & { categories?: string[] }>
): Promise<{ data: Product | null; error: Error | null }> {
  try {
    // Extract categories if provided (handle separately)
    const categories = updates.categories;
    const updateData: any = { ...updates };
    delete updateData.categories;
    
    // Only include default_coupon_id if it's explicitly provided (column might not exist yet)
    if ('default_coupon_id' in updates) {
      updateData.default_coupon_id = updates.default_coupon_id;
    }
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    // Update categories in junction table if provided
    if (categories !== undefined) {
      const categoryError = await setProductCategories(productId, categories);
      if (categoryError.error) {
        console.error('Error updating product categories:', categoryError.error);
        // Don't fail the whole operation, just log the error
      }
    }

    return { data: data as Product, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Upload product image to Supabase Storage
 */
export async function uploadProductImage(
  file: File,
  productId: string
): Promise<{ url: string | null; error: Error | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${productId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      return { url: null, error };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: null, error: error as Error };
  }
}

/**
 * Add product image to database
 */
export async function addProductImage(
  productId: string,
  imageData: {
    url: string;
    alt_text?: string;
    variant_id?: string;
    position?: number;
  }
): Promise<{ data: ProductImage | null; error: Error | null }> {
  try {
    const { data: images } = await supabase
      .from('product_images')
      .select('position')
      .eq('product_id', productId)
      .order('position', { ascending: false })
      .limit(1);

    const maxPosition = images && images.length > 0 ? images[0].position : -1;

    const { data, error } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        url: imageData.url,
        alt_text: imageData.alt_text || null,
        variant_id: imageData.variant_id || null,
        position: imageData.position !== undefined ? imageData.position : maxPosition + 1,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as ProductImage, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Delete product image
 */
export async function deleteProductImage(imageId: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}

/**
 * Create product variant
 */
export async function createProductVariant(
  productId: string,
  variantData: {
    title: string;
    sku?: string;
    price: number;
    compare_at_price?: number;
    cost?: number;
    currency_code?: string;
    inventory_quantity?: number;
    inventory_policy?: 'deny' | 'continue';
    weight?: number;
    position?: number;
    available?: boolean;
  }
): Promise<{ data: ProductVariant | null; error: Error | null }> {
  try {
    const { data: variants } = await supabase
      .from('product_variants')
      .select('position')
      .eq('product_id', productId)
      .order('position', { ascending: false })
      .limit(1);

    const maxPosition = variants && variants.length > 0 ? variants[0].position : -1;

    const { data, error } = await supabase
      .from('product_variants')
      .insert({
        product_id: productId,
        ...variantData,
        currency_code: variantData.currency_code || 'INR',
        inventory_quantity: variantData.inventory_quantity || 0,
        inventory_policy: variantData.inventory_policy || 'deny',
        position: variantData.position !== undefined ? variantData.position : maxPosition + 1,
        available: variantData.available !== undefined ? variantData.available : true,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as ProductVariant, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Update product variant
 */
export async function updateProductVariant(
  variantId: string,
  updates: Partial<ProductVariant>
): Promise<{ data: ProductVariant | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('product_variants')
      .update(updates)
      .eq('id', variantId)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data as ProductVariant, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/**
 * Delete product variant
 */
export async function deleteProductVariant(variantId: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantId);

    if (error) {
      return { error };
    }

    return { error: null };
  } catch (error) {
    return { error: error as Error };
  }
}



