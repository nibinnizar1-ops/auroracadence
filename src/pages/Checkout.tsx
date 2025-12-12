import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useAddressStore } from "@/stores/addressStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CouponSelector } from "@/components/CouponSelector";

declare global {
  interface Window {
    Layer: any;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { 
    items, 
    clearCart, 
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getTotal
  } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { addresses, loadAddresses, getDefaultAddress } = useAddressStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [saveAddress, setSaveAddress] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Load addresses when user is logged in
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadAddresses(user.id);
    }
  }, [isAuthenticated, user?.id, loadAddresses]);

  // Pre-fill form with user email if logged in
  useEffect(() => {
    if (user?.email && !formData.email) {
      setFormData(prev => ({ ...prev, email: user.email || "" }));
    }
    if (user?.name && !formData.name) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [user]);

  // Load default address when addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && selectedAddressId === "new") {
      const defaultAddr = getDefaultAddress();
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        handleAddressSelect(defaultAddr.id);
      }
    }
  }, [addresses, getDefaultAddress]);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    
    if (addressId === "new") {
      // Clear form for new address
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
      });
    } else {
      // Load selected address
      const address = addresses.find(addr => addr.id === addressId);
      if (address) {
        setFormData({
          name: address.full_name,
          email: user?.email || formData.email,
          phone: address.phone,
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        });
      }
    }
  };

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const totalPrice = getTotal();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const result = await applyCoupon(couponCode, user?.id);
      if (result.valid) {
        toast.success(`Coupon "${result.coupon?.code}" applied! You saved ₹${result.discount.toFixed(2)}`);
        setCouponCode("");
      } else {
        toast.error(result.error || "Invalid coupon code");
      }
    } catch (error) {
      toast.error("Failed to apply coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast.success("Coupon removed");
  };

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

    // Save address if user is logged in and requested
    if (isAuthenticated && user?.id && saveAddress && selectedAddressId === "new") {
      try {
        const { addAddress } = useAddressStore.getState();
        await addAddress(user.id, {
          label: "Home",
          full_name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          is_default: addresses.length === 0, // Set as default if first address
        });
        toast.success("Address saved!");
      } catch (error) {
        console.error("Error saving address:", error);
        // Continue with payment even if address save fails
      }
    }

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
            userId: user?.id || null, // Pass user ID if logged in
            items: items.map(item => ({
              id: item.product.node.id,
              title: item.product.node.title,
              variantTitle: item.variantTitle,
              price: item.price.amount,
              quantity: item.quantity,
            })),
            couponCode: appliedCoupon?.code || null,
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
              {/* Saved Addresses Selector (if logged in) */}
              {isAuthenticated && addresses.length > 0 && (
                <div>
                  <Label>Select Saved Address</Label>
                  <Select value={selectedAddressId} onValueChange={handleAddressSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an address" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">+ Add New Address</SelectItem>
                      {addresses.map((address) => (
                        <SelectItem key={address.id} value={address.id}>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{address.label || "Address"}</div>
                              <div className="text-sm text-muted-foreground">
                                {address.address}, {address.city}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

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

              {/* Save Address Checkbox (if logged in and new address) */}
              {isAuthenticated && selectedAddressId === "new" && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="saveAddress"
                    checked={saveAddress}
                    onChange={(e) => setSaveAddress(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="saveAddress" className="font-normal cursor-pointer">
                    Save this address for future orders
                  </Label>
                </div>
              )}
              
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

            {/* Coupon Selector */}
            <CouponSelector onCouponApplied={() => setCouponCode("")} />

            {/* Manual Coupon Input (Alternative) */}
            <div className="space-y-2">
              {!appliedCoupon ? (
                <div className="space-y-2">
                  <Label htmlFor="coupon">Or enter coupon code manually</Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyCoupon();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      variant="outline"
                    >
                      {isApplyingCoupon ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Tag className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-md">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{appliedCoupon.code}</span>
                    <span className="text-xs text-muted-foreground">
                      -₹{discount.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleRemoveCoupon}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-primary">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
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
