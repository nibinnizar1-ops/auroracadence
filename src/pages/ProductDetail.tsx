import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { getProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { Navigation } from "@/components/Navigation";
import { toast } from "sonner";

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      try {
        const data = await getProductByHandle(handle);
        setProduct(data);
        setSelectedVariant(data?.variants?.edges?.[0]?.node);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.title} has been added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-secondary rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-secondary rounded" />
              <div className="space-y-4">
                <div className="h-8 bg-secondary rounded w-3/4" />
                <div className="h-6 bg-secondary rounded w-1/2" />
                <div className="h-24 bg-secondary rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-serif text-gold mb-4">Product Not Found</h2>
          <Link to="/">
            <Button className="bg-gold text-background hover:bg-gold-dark">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-gold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <img
                src={product.images?.edges?.[0]?.node?.url}
                alt={product.title}
                className="w-full aspect-square object-cover"
              />
            </Card>
            {product.images?.edges?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.edges.slice(1, 5).map((image: any, index: number) => (
                  <Card key={index} className="overflow-hidden cursor-pointer hover:border-gold transition-all">
                    <img
                      src={image.node.url}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full aspect-square object-cover"
                    />
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-serif text-gold mb-2">{product.title}</h1>
              <p className="text-3xl font-semibold text-foreground">
                {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
              </p>
            </div>

            <div className="prose prose-invert">
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {product.options?.length > 0 && (
              <div className="space-y-4">
                {product.options.map((option: any) => (
                  <div key={option.name}>
                    <label className="text-sm font-medium mb-2 block">{option.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value: string) => (
                        <Button
                          key={value}
                          variant="outline"
                          className="border-gold text-foreground hover:bg-gold hover:text-background"
                          size="sm"
                        >
                          {value}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              className="w-full bg-gold text-background hover:bg-gold-dark"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>

            <div className="border-t border-border pt-6 space-y-2 text-sm text-muted-foreground">
              <p>• Free shipping on orders over ₹2000</p>
              <p>• 30-day return policy</p>
              <p>• Lifetime warranty on craftsmanship</p>
              <p>• Ethically sourced materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
