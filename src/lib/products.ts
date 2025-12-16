import { supabase } from "@/integrations/supabase/client";

// Database types matching our schema
export interface Product {
  id: string;
  title: string;
  description: string | null;
  handle: string;
  product_type: string | null;
  status: 'active' | 'draft' | 'archived';
  featured: boolean;
  category: string | null;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  discount_type: 'percentage' | 'fixed' | null;
  discount_value: number | null;
  discount_valid_from: string | null;
  discount_valid_until: string | null;
  eligible_for_coupons: boolean;
  default_coupon_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  cost: number | null;
  currency_code: string;
  inventory_quantity: number;
  inventory_policy: 'deny' | 'continue';
  weight: number | null;
  position: number;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id: string | null;
  url: string;
  alt_text: string | null;
  position: number;
  created_at: string;
}

export interface ProductOption {
  id: string;
  variant_id: string;
  name: string;
  value: string;
  created_at: string;
}

// Extended product with relations
export interface ProductWithRelations extends Product {
  variants: ProductVariant[];
  images: ProductImage[];
  options: ProductOption[];
}

// Shopify-compatible format for backward compatibility
export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

// Transform database product to Shopify-compatible format
function transformToShopifyFormat(product: ProductWithRelations): ShopifyProduct {
  // Filter valid variants (available, with price > 0, and title not empty)
  const validVariants = product.variants.filter(v => 
    v.available !== false && 
    v.price > 0 && 
    v.title && 
    v.title.trim() !== ''
  );
  
  // If no valid variants, use first variant anyway (for debugging)
  const variantsToUse = validVariants.length > 0 ? validVariants : product.variants;
  
  // Get minimum price from valid variants
  const prices = variantsToUse.map(v => parseFloat(v.price.toString()));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const minPriceVariant = variantsToUse.find(v => 
    parseFloat(v.price.toString()) === minPrice
  ) || variantsToUse[0];

  // Group options by name
  const optionsMap = new Map<string, Set<string>>();
  product.variants.forEach(variant => {
    const variantOptions = product.options.filter(opt => opt.variant_id === variant.id);
    variantOptions.forEach(opt => {
      if (!optionsMap.has(opt.name)) {
        optionsMap.set(opt.name, new Set());
      }
      optionsMap.get(opt.name)!.add(opt.value);
    });
  });

  const options = Array.from(optionsMap.entries()).map(([name, values]) => ({
    name,
    values: Array.from(values)
  }));

  return {
    node: {
      id: product.id,
      title: product.title,
      description: product.description || '',
      handle: product.handle,
      productType: product.product_type || '',
      // Include discount fields
      discount_type: product.discount_type || null,
      discount_value: product.discount_value || null,
      discount_valid_from: product.discount_valid_from || null,
      discount_valid_until: product.discount_valid_until || null,
      default_coupon_id: product.default_coupon_id || null,
      priceRange: {
        minVariantPrice: {
          amount: minPrice.toString(),
          currencyCode: minPriceVariant?.currency_code || 'INR'
        }
      },
      images: {
        edges: product.images
          .sort((a, b) => a.position - b.position)
          .map(img => ({
            node: {
              url: img.url,
              altText: img.alt_text
            }
          }))
      },
      variants: {
        edges: variantsToUse
          .sort((a, b) => a.position - b.position)
          .map(variant => {
            const variantOptions = product.options
              .filter(opt => opt.variant_id === variant.id)
              .map(opt => ({
                name: opt.name,
                value: opt.value
              }));

            return {
              node: {
                id: variant.id,
                title: variant.title,
                price: {
                  amount: variant.price.toString(),
                  currencyCode: variant.currency_code
                },
                compare_at_price: variant.compare_at_price || null,
                compareAtPrice: variant.compare_at_price || null, // Alias for compatibility
                availableForSale: variant.available && 
                  (variant.inventory_policy === 'continue' || variant.inventory_quantity > 0),
                selectedOptions: variantOptions
              }
            };
          })
      },
      options
    }
  };
}

/**
 * Fetch products from Supabase
 * @param limit - Maximum number of products to fetch
 * @param offset - Number of products to skip
 * @param category - Filter by category handle
 * @param featured - Filter by featured products
 * @param search - Search query
 */
export async function getProducts(
  limit: number = 20,
  offset: number = 0,
  category?: string,
  featured?: boolean,
  search?: string
): Promise<ShopifyProduct[]> {
  try {
    // Select only base columns that definitely exist (safer for missing migrations)
    // Try with all columns first, fallback to base columns if error
    let query = supabase
      .from('products')
      .select(`
        id,
        title,
        description,
        handle,
        product_type,
        status,
        featured,
        category,
        tags,
        meta_title,
        meta_description,
        created_at,
        updated_at,
        product_variants (
          *,
          product_options (*)
        ),
        product_images (*)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (featured !== undefined) {
      query = query.eq('featured', featured);
    }

    // Note: Category filtering will be handled separately in getProductsByCategory
    // For now, we'll filter by the category field if it exists
    if (category) {
      query = query.eq('category', category);
    }

    if (search) {
      // Full-text search on title and description
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      // Return empty array instead of throwing to prevent page crash
      return [];
    }

    if (!data || data.length === 0) {
      console.log('[getProducts] No products found');
      return [];
    }

    // Transform to Shopify-compatible format
    // Normalize data structure (Supabase returns product_variants with nested product_options, product_images)
    const normalizedData = data.map(p => {
      // Extract options from nested variants structure
      const allOptions: any[] = [];
      (p.product_variants || []).forEach((variant: any) => {
        if (variant.product_options) {
          allOptions.push(...variant.product_options);
        }
      });
      
      return {
        ...p,
        variants: p.product_variants || [],
        images: p.product_images || [],
        options: allOptions
      };
    });

    // Filter out products with no variants or invalid variants
    const productsWithVariants = normalizedData.filter(p => {
      if (!p.variants || p.variants.length === 0) {
        console.warn(`[Product ${p.id}] ${p.title} - No variants found`);
        return false;
      }
      // Check if product has at least one valid variant
      const validVariants = p.variants.filter(v => {
        const isValid = v.available !== false && 
                        v.price > 0 && 
                        v.title && 
                        v.title.trim() !== '';
        if (!isValid) {
          console.warn(`[Product ${p.id}] ${p.title} - Invalid variant:`, {
            variantId: v.id,
            available: v.available,
            price: v.price,
            title: v.title
          });
        }
        return isValid;
      });
      
      if (validVariants.length === 0) {
        console.warn(`[Product ${p.id}] ${p.title} - No valid variants (check: available=true, price>0, title not empty)`);
        return false;
      }
      return true;
    });
    
    console.log(`[getProducts] Found ${productsWithVariants.length} products with valid variants out of ${data.length} total`);
    return productsWithVariants.map(transformToShopifyFormat);
  } catch (error) {
    console.error('Error in getProducts:', error);
    return [];
  }
}

/**
 * Fetch a single product by handle
 * @param handle - Product handle (slug)
 */
export async function getProductByHandle(handle: string): Promise<ShopifyProduct['node'] | null> {
  try {
    // Decode URL-encoded handle if needed
    const decodedHandle = decodeURIComponent(handle);
    console.log('[getProductByHandle] Looking for handle:', decodedHandle);
    
    // Build base query
    const baseQuery = supabase
      .from('products')
      .select(`
        id,
        title,
        description,
        handle,
        product_type,
        status,
        featured,
        category,
        tags,
        meta_title,
        meta_description,
        created_at,
        updated_at,
        product_variants (
          *,
          product_options (*)
        ),
        product_images (*)
      `)
      .eq('status', 'active');
    
    // Try exact match first
    let { data, error } = await baseQuery.eq('handle', decodedHandle).single();
    
    // If not found, try normalized versions (spaces <-> hyphens)
    if (error && error.code === 'PGRST116') {
      console.log('[getProductByHandle] Exact match not found, trying normalized versions...');
      
      // Try with hyphens instead of spaces
      const hyphenHandle = decodedHandle.replace(/\s+/g, '-').replace(/-+/g, '-');
      const { data: hyphenData, error: hyphenError } = await baseQuery
        .eq('handle', hyphenHandle)
        .single();
      
      if (!hyphenError && hyphenData) {
        console.log('[getProductByHandle] Found with hyphen handle:', hyphenHandle);
        data = hyphenData;
        error = null;
      } else {
        // Try with spaces instead of hyphens
        const spaceHandle = decodedHandle.replace(/-/g, ' ');
        const { data: spaceData, error: spaceError } = await baseQuery
          .eq('handle', spaceHandle)
          .single();
        
        if (!spaceError && spaceData) {
          console.log('[getProductByHandle] Found with space handle:', spaceHandle);
          data = spaceData;
          error = null;
        }
      }
    }

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        console.log(`[getProductByHandle] Product not found: ${handle}`);
        return null;
      }
      console.error('Error fetching product:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return null;
    }

    if (!data) {
      console.log(`[getProductByHandle] No data returned for: ${handle}`);
      return null;
    }

    // Normalize data structure (Supabase returns product_variants, product_images, product_options)
    const normalizedData = {
      ...data,
      variants: data.product_variants || [],
      images: data.product_images || [],
      options: data.product_options || []
    };

    // Check if product has variants
    if (normalizedData.variants.length === 0) {
      console.warn(`[getProductByHandle] Product ${data.id} has no variants`);
      return null;
    }

    // Check if product has valid variants
    const validVariants = normalizedData.variants.filter((v: any) => 
      v.available !== false && 
      v.price > 0 && 
      v.title && 
      v.title.trim() !== ''
    );

    if (validVariants.length === 0) {
      console.warn(`[getProductByHandle] Product ${data.id} has no valid variants`);
      return null;
    }

    const transformed = transformToShopifyFormat(normalizedData);
    return transformed.node;
  } catch (error) {
    console.error('Error in getProductByHandle:', error);
    return null;
  }
}

/**
 * Search products by query string
 * @param query - Search query
 * @param limit - Maximum number of results
 */
export async function searchProducts(
  query: string,
  limit: number = 20
): Promise<ShopifyProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id,
        title,
        description,
        handle,
        product_type,
        status,
        featured,
        category,
        tags,
        meta_title,
        meta_description,
        created_at,
        updated_at,
        product_variants (
          *,
          product_options (*)
        ),
        product_images (*)
      `)
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Normalize data structure (product_options is nested inside product_variants)
    const normalizedData = data.map(p => {
      // Extract options from nested variants structure
      const allOptions: any[] = [];
      (p.product_variants || []).forEach((variant: any) => {
        if (variant.product_options) {
          allOptions.push(...variant.product_options);
        }
      });
      
      return {
        ...p,
        variants: p.product_variants || [],
        images: p.product_images || [],
        options: allOptions
      };
    });

    return normalizedData.map(transformToShopifyFormat);
  } catch (error) {
    console.error('Error in searchProducts:', error);
    return [];
  }
}

/**
 * Get products by category handle
 * @param categoryHandle - Category handle (slug)
 * @param limit - Maximum number of products
 */
export async function getProductsByCategory(
  categoryName: string,
  limit: number = 20
): Promise<ShopifyProduct[]> {
  try {
    // Get product IDs from product_categories junction table
    const { data: categoryData, error: categoryError } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_name', categoryName);

    if (categoryError) {
      console.error('Error fetching products by category from junction table:', categoryError);
      // Fallback to old category field
      return getProductsByCategoryLegacy(categoryName, limit);
    }

    const productIds = categoryData?.map(item => item.product_id) || [];

    // If no products found in junction table, fallback to legacy category field
    if (productIds.length === 0) {
      return getProductsByCategoryLegacy(categoryName, limit);
    }

    // Fetch products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        title,
        description,
        handle,
        product_type,
        status,
        featured,
        category,
        tags,
        meta_title,
        meta_description,
        created_at,
        updated_at,
        product_variants (
          *,
          product_options (*)
        ),
        product_images (*)
      `)
      .eq('status', 'active')
      .in('id', productIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (productsError) {
      console.error('Error fetching products by category:', productsError);
      return [];
    }

    if (!products || products.length === 0) {
      return [];
    }

    // Normalize data structure (product_options is nested inside product_variants)
    const normalizedProducts = products.map(p => {
      // Extract options from nested variants structure
      const allOptions: any[] = [];
      (p.product_variants || []).forEach((variant: any) => {
        if (variant.product_options) {
          allOptions.push(...variant.product_options);
        }
      });
      
      return {
        ...p,
        variants: p.product_variants || [],
        images: p.product_images || [],
        options: allOptions
      };
    });

    return normalizedProducts.map(transformToShopifyFormat);
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
}

/**
 * Legacy function to fetch products by category (using old category field)
 * Used as fallback when junction table has no entries
 */
async function getProductsByCategoryLegacy(
  categoryName: string,
  limit: number = 20
): Promise<ShopifyProduct[]> {
  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        title,
        description,
        handle,
        product_type,
        status,
        featured,
        category,
        tags,
        meta_title,
        meta_description,
        created_at,
        updated_at,
        product_variants (
          *,
          product_options (*)
        ),
        product_images (*)
      `)
      .eq('status', 'active')
      .eq('category', categoryName)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (productsError) {
      console.error('Error fetching products by category (legacy):', productsError);
      return [];
    }

    if (!products || products.length === 0) {
      return [];
    }

    // Normalize data structure
    const normalizedProducts = products.map(p => {
      const allOptions: any[] = [];
      (p.product_variants || []).forEach((variant: any) => {
        if (variant.product_options) {
          allOptions.push(...variant.product_options);
        }
      });
      
      return {
        ...p,
        variants: p.product_variants || [],
        images: p.product_images || [],
        options: allOptions
      };
    });

    return normalizedProducts.map(transformToShopifyFormat);
  } catch (error) {
    console.error('Error in getProductsByCategoryLegacy:', error);
    return [];
  }
}

