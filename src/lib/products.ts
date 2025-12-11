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
  // Get minimum price from variants
  const prices = product.variants
    .filter(v => v.available)
    .map(v => parseFloat(v.price.toString()));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const minPriceVariant = product.variants.find(v => 
    v.available && parseFloat(v.price.toString()) === minPrice
  ) || product.variants[0];

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
        edges: product.variants
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
    let query = supabase
      .from('products')
      .select(`
        *,
        product_variants (*),
        product_images (*),
        product_options (*)
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
      throw error;
    }

    if (!data) {
      return [];
    }

    // Transform to Shopify-compatible format
    return data.map(transformToShopifyFormat);
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
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_variants (*),
        product_images (*),
        product_options (*)
      `)
      .eq('handle', handle)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Error fetching product:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    const transformed = transformToShopifyFormat(data);
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
        *,
        product_variants (*),
        product_images (*),
        product_options (*)
      `)
      .eq('status', 'active')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    return data.map(transformToShopifyFormat);
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
  categoryHandle: string,
  limit: number = 20
): Promise<ShopifyProduct[]> {
  try {
    // First get the category ID
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('handle', categoryHandle)
      .single();

    if (categoryError || !category) {
      return [];
    }

    // Get product IDs from category_products
    const { data: categoryProducts, error: cpError } = await supabase
      .from('category_products')
      .select('product_id')
      .eq('category_id', category.id);

    if (cpError || !categoryProducts || categoryProducts.length === 0) {
      return [];
    }

    const productIds = categoryProducts.map(cp => cp.product_id);

    // Fetch products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        product_variants (*),
        product_images (*),
        product_options (*)
      `)
      .eq('status', 'active')
      .in('id', productIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (productsError) {
      console.error('Error fetching products by category:', productsError);
      throw productsError;
    }

    if (!products) {
      return [];
    }

    return products.map(transformToShopifyFormat);
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return [];
  }
}

