import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Wishlist = () => {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore(state => state.addItem);

  const handleAddToCart = (product: any) => {
    const firstVariant = product.node.variants.edges[0]?.node;
    
    if (firstVariant) {
      const cartItem = {
        product,
        variantId: firstVariant.id,
        variantTitle: firstVariant.title,
        price: firstVariant.price,
        quantity: 1,
        selectedOptions: firstVariant.selectedOptions,
      };
      
      addToCart(cartItem);
      toast.success("Added to cart!");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">My Wishlist</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground mb-4">Your wishlist is empty</p>
            <Button asChild>
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => {
              const firstImage = product.node.images?.edges?.[0]?.node;
              const firstVariant = product.node.variants.edges[0]?.node;

              return (
                <Card key={product.node.id} className="group overflow-hidden">
                  <Link to={`/product/${product.node.handle}`}>
                    <div className="aspect-square overflow-hidden bg-secondary/20">
                      {firstImage && (
                        <img
                          src={firstImage.url}
                          alt={firstImage.altText || product.node.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  </Link>
                  
                  <CardContent className="p-4">
                    <Link to={`/product/${product.node.handle}`}>
                      <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                        {product.node.title}
                      </h3>
                    </Link>
                    
                    {firstVariant && (
                      <p className="text-lg font-bold text-primary mb-4">
                        {firstVariant.price.currencyCode} {parseFloat(firstVariant.price.amount).toFixed(2)}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      
                      <Button
                        onClick={() => removeItem(product.node.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;
