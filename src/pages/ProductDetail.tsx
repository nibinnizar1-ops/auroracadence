import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShoppingCart, ArrowLeft, Tag, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getProductByHandle } from "@/lib/products";
import { useCartStore } from "@/stores/cartStore";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";
import { getCouponById } from "@/lib/coupons";

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [coupon, setCoupon] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      try {
        // Decode URL-encoded handle (e.g., "irani%20Chain" -> "irani Chain")
        const decodedHandle = decodeURIComponent(handle);
        console.log('[ProductDetail] Fetching product with handle:', decodedHandle);
        const data = await getProductByHandle(decodedHandle);
        if (data) {
          console.log('[ProductDetail] Product found:', data.title);
          console.log('[ProductDetail] Product data:', JSON.stringify(data, null, 2));
          setProduct(data);
          setSelectedVariant(data?.variants?.edges?.[0]?.node);
          
          // Fetch coupon if product has default_coupon_id
          if (data.default_coupon_id) {
            const couponData = await getCouponById(data.default_coupon_id);
            if (couponData) {
              setCoupon(couponData);
            }
          }
        } else {
          console.warn('[ProductDetail] Product not found for handle:', decodedHandle);
        }
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
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-20 flex-grow">
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
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center flex-grow">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Product Not Found</h2>
          <Link to="/">
            <Button className="bg-foreground text-background hover:bg-foreground/90">
              Return to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-12 flex-grow">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Card className="overflow-hidden border-border cursor-pointer" onClick={() => product.images?.edges?.[0] && setSelectedImageIndex(0)}>
              <img
                src={product.images?.edges?.[0]?.node?.url}
                alt={product.title}
                className="w-full aspect-square object-cover hover:opacity-90 transition-opacity"
              />
            </Card>
            {product.images?.edges?.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.edges.slice(1, 5).map((image: any, index: number) => (
                  <Card 
                    key={index} 
                    className="overflow-hidden cursor-pointer hover:border-foreground transition-all"
                    onClick={() => setSelectedImageIndex(index + 1)}
                  >
                    <img
                      src={image.node.url}
                      alt={`${product.title} ${index + 2}`}
                      className="w-full aspect-square object-cover hover:opacity-90 transition-opacity"
                    />
                  </Card>
                ))}
              </div>
            )}

            {/* Image Gallery Modal */}
            {selectedImageIndex !== null && product.images?.edges && (
              <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
                <DialogContent className="max-w-4xl w-full p-0">
                  <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center justify-between">
                      <span>Product Images ({selectedImageIndex + 1} / {product.images.edges.length})</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedImageIndex(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="relative">
                    <img
                      src={product.images.edges[selectedImageIndex].node.url}
                      alt={product.title}
                      className="w-full h-[70vh] object-contain"
                    />
                    {product.images.edges.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                          onClick={() => setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : product.images.edges.length - 1)}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                          onClick={() => setSelectedImageIndex(selectedImageIndex < product.images.edges.length - 1 ? selectedImageIndex + 1 : 0)}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </>
                    )}
                    {/* Thumbnail strip */}
                    <div className="flex gap-2 p-4 overflow-x-auto bg-background border-t">
                      {product.images.edges.map((image: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                            index === selectedImageIndex ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={image.node.url}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{product.title}</h1>
              
              {/* Coupon Badge */}
              {coupon && (
                <div className="mb-3 inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-md">
                  <Tag className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Use Code: <span className="font-bold">{coupon.code}</span>
                    {coupon.discount_type === 'percentage' 
                      ? ` - ${coupon.discount_value}% OFF`
                      : ` - ₹${coupon.discount_value} OFF`}
                  </span>
                </div>
              )}
              
              {/* Price Display */}
              <div className="space-y-1">
                {(() => {
                  // Handle both Shopify format (price.amount) and direct format (price)
                  const variantPrice = selectedVariant?.price?.amount 
                    ? parseFloat(selectedVariant.price.amount) 
                    : (selectedVariant?.price || 0);
                  
                  let finalPrice = variantPrice;
                  let originalPrice = variantPrice;
                  let discountAmount = 0;
                  
                  // Calculate product-level discount
                  if (product.discount_type && product.discount_value) {
                    const now = new Date();
                    const validFrom = product.discount_valid_from ? new Date(product.discount_valid_from) : null;
                    const validUntil = product.discount_valid_until ? new Date(product.discount_valid_until) : null;
                    
                    const isDiscountValid = (!validFrom || now >= validFrom) && (!validUntil || now <= validUntil);
                    
                    if (isDiscountValid) {
                      if (product.discount_type === 'percentage') {
                        discountAmount = (variantPrice * product.discount_value) / 100;
                      } else {
                        discountAmount = product.discount_value;
                      }
                      finalPrice = Math.max(0, variantPrice - discountAmount);
                      originalPrice = variantPrice;
                    }
                  }
                  
                  // Check if variant has compare_at_price
                  const comparePrice = selectedVariant?.compare_at_price || selectedVariant?.compareAtPrice;
                  if (comparePrice && comparePrice > variantPrice) {
                    originalPrice = comparePrice;
                    finalPrice = variantPrice;
                    discountAmount = originalPrice - finalPrice;
                  }
                  
                  const showDiscount = discountAmount > 0 && originalPrice > finalPrice;
                  
                  return (
                    <>
                      {showDiscount ? (
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <p className="text-3xl font-semibold text-foreground">
                            ₹{finalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xl line-through text-muted-foreground">
                            ₹{originalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                          <span className="text-sm font-semibold text-destructive bg-destructive/10 px-2 py-1 rounded">
                            {Math.round((discountAmount / originalPrice) * 100)}% OFF
                          </span>
                        </div>
                      ) : (
                        <p className="text-3xl font-semibold text-foreground">
                          ₹{variantPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="prose prose-invert">
              <p className="text-muted-foreground whitespace-pre-line">{product.description || "No description available."}</p>
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
                          className="border-foreground text-foreground hover:bg-foreground hover:text-background"
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
              className="w-full bg-foreground text-background hover:bg-foreground/90"
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
      <Footer />
    </div>
  );
}
