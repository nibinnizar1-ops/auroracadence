import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

declare global {
  interface Window {
    Layer: any;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const totalPrice = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loadZwitchScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://payments.open.money/layer";
      script.id = "context";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Load Zwitch script
      const scriptLoaded = await loadZwitchScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Zwitch SDK");
      }

      // Create payment token in backend
      const { data: orderData, error: orderError } = await supabase.functions.invoke(
        "create-razorpay-order",
        {
          body: {
            amount: Math.round(totalPrice * 100), // Convert to paise
            currency: items[0]?.price.currencyCode || "INR",
            customerInfo: formData,
            items: items.map(item => ({
              id: item.product.node.id,
              title: item.product.node.title,
              variantTitle: item.variantTitle,
              price: item.price.amount,
              quantity: item.quantity,
            })),
          },
        }
      );

      if (orderError) throw orderError;

      console.log('Opening Zwitch payment with token:', orderData.paymentToken);

      // Open Zwitch Layer payment page
      window.Layer.checkout(
        {
          token: orderData.paymentToken,
          accesskey: orderData.accessKey,
          theme: {
            color: "#3d9080",
            error_color: "#ff2b2b",
          }
        },
        async function(response: any) {
          console.log('Zwitch payment response:', response);
          
          if (response.status === "captured") {
            try {
              // Verify payment
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
                "verify-razorpay-payment",
                {
                  body: {
                    payment_token_id: response.payment_token_id,
                    payment_id: response.payment_id,
                    status: response.status,
                    dbOrderId: orderData.dbOrderId,
                  },
                }
              );

              if (verifyError) throw verifyError;

              toast.success("Payment successful!");
              clearCart();
              navigate("/");
            } catch (error) {
              console.error("Payment verification failed:", error);
              toast.error("Payment verification failed");
            }
          } else if (response.status === "failed") {
            toast.error("Payment failed. Please try again.");
          } else if (response.status === "cancelled") {
            toast.error("Payment cancelled.");
          }
        },
        function(err: any) {
          console.error("Zwitch integration error:", err);
          toast.error("Payment gateway error: " + (err.message || "Unknown error"));
        }
      );
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to initiate payment");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => navigate("/")}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${totalPrice.toFixed(2)}`
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-4">
                <div className="w-16 h-16 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                  {item.product.node.images?.edges?.[0]?.node && (
                    <img
                      src={item.product.node.images.edges[0].node.url}
                      alt={item.product.node.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.node.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {item.selectedOptions.map(opt => opt.value).join(" • ")}
                  </p>
                  <p className="text-sm">Qty: {item.quantity}</p>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">
                    {item.price.currencyCode} {(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
