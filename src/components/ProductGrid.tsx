import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { ShoppingCart, Heart } from "lucide-react";
import { getProducts, ShopifyProduct } from "@/lib/products";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const ProductGrid = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(20);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const filteredProducts = searchQuery 
    ? products.filter(product => 
        product.node.title.toLowerCase().includes(searchQuery) ||
        product.node.description.toLowerCase().includes(searchQuery)
      )
    : products;

  const handleToggleWishlist = (product: ShopifyProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.node.id)) {
      removeFromWishlist(product.node.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (product: ShopifyProduct) => {
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-secondary" />
            <CardContent className="p-4 space-y-2">
              <div className="h-4 bg-secondary rounded w-3/4" />
              <div className="h-4 bg-secondary rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0 || filteredProducts.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold text-foreground mb-4">
          {searchQuery ? 'No products match your search' : 'No Products Found'}
        </h3>
        <p className="text-muted-foreground mb-6">
          {searchQuery ? 'Try a different search term' : "We're currently setting up our collection. Check back soon!"}
        </p>
        {!searchQuery && (
          <p className="text-sm text-muted-foreground">
            Or tell us what jewelry pieces you'd like to see in our store.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => {
        const variant = product.node.variants.edges[0]?.node;
        const image = product.node.images.edges[0]?.node;

        return (
          <Card key={product.node.id} className="group overflow-hidden border-border hover:border-foreground transition-all hover:shadow-lg">
            <Link to={`/product/${product.node.handle}`} className="relative block">
              <div className="aspect-square overflow-hidden bg-secondary">
                {image && (
                  <img
                    src={image.url}
                    alt={image.altText || product.node.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                onClick={(e) => handleToggleWishlist(product, e)}
              >
                <Heart 
                  className={cn(
                    "h-5 w-5",
                    isInWishlist(product.node.id) ? "fill-primary text-primary" : ""
                  )}
                />
              </Button>
            </Link>
            <CardContent className="p-4">
              <Link to={`/product/${product.node.handle}`}>
                <h3 className="font-medium text-foreground group-hover:text-accent transition-colors">
                  {product.node.title}
                </h3>
              </Link>
              <p className="text-foreground font-semibold mt-2">
                {variant?.price.currencyCode} {parseFloat(variant?.price.amount || "0").toFixed(2)}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-foreground text-background hover:bg-foreground/90"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
