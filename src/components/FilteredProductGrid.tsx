import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { getProducts, getProductsByCategory, ShopifyProduct } from "@/lib/products";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";

const categories = ["All", "Necklaces", "Rings", "Earrings", "Bracelets"];

export const FilteredProductGrid = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let data: ShopifyProduct[];
        
        if (activeFilter === "All") {
          // Fetch all products
          data = await getProducts(50);
        } else {
          // Fetch products by category name (from product_categories junction table)
          data = await getProductsByCategory(activeFilter, 50);
        }
        
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeFilter]);

  const filteredProducts = products;

  const handleToggleWishlist = (product: ShopifyProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = product.node.id;
    if (wishlistItems.some(item => item.node.id === productId)) {
      removeFromWishlist(productId);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (product: ShopifyProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    const cartItem = {
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.node.title} has been added to your cart`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Filter Buttons */}
      <div className="flex justify-center gap-3 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-8 py-3 text-sm font-medium uppercase tracking-wider transition-all ${
              activeFilter === category
                ? "bg-foreground text-background"
                : "bg-background text-foreground border border-foreground hover:bg-foreground/5"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-secondary/20 rounded" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-secondary/20 rounded w-3/4 mx-auto" />
                <div className="h-5 bg-secondary/20 rounded w-1/2 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredProducts.map((product) => {
            const productImage = product.node.images.edges[0]?.node.url || "";
            const productTitle = product.node.title;
            const productPrice = parseFloat(product.node.priceRange.minVariantPrice.amount);
            const currencyCode = product.node.priceRange.minVariantPrice.currencyCode;
            const tags = product.node.title.includes("NEW") || product.node.title.includes("BESTSELLER") || product.node.title.includes("BUY 1 GET 1");
            
            return (
              <Link
                key={product.node.id}
                to={`/product/${product.node.handle}`}
                className="group relative bg-background transition-all cursor-pointer"
              >
                {/* Product Image */}
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={productImage}
                    alt={productTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Hover Actions - Overlay on Image */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/60 to-transparent">
                    {/* Wishlist Button - Left */}
                    <button 
                      onClick={(e) => handleToggleWishlist(product, e)}
                      className="p-2 hover:text-foreground text-white transition-colors" 
                      title={wishlistItems.some(item => item.node.id === product.node.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`h-5 w-5 ${wishlistItems.some(item => item.node.id === product.node.id) ? 'fill-current' : ''}`} />
                    </button>
                    
                    {/* ADD TO BAG Button - Right */}
                    <Button 
                      onClick={(e) => handleAddToCart(product, e)}
                      variant="ghost" 
                      className="text-xs uppercase tracking-wider px-4 hover:bg-white/20 text-white border border-white/50 hover:border-white"
                    >
                      ADD TO BAG
                    </Button>
                  </div>
                </div>

                {/* Product Info - Centered */}
                <div className="p-4 space-y-2 flex flex-col items-center text-center">
                  <h3 className="text-sm font-medium text-foreground">
                    {productTitle}
                  </h3>
                  
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-lg font-semibold text-foreground">
                      {currencyCode === "INR" ? "₹" : currencyCode} {productPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
