import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, X, Tag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { CouponSelector } from "./CouponSelector";

export const CartDrawer = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { 
    items, 
    updateQuantity, 
    removeItem,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscount,
    getTotal
  } = useCartStore();
  const { user } = useAuthStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = getSubtotal();
  const discount = getDiscount();
  const total = getTotal();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-foreground hover:bg-secondary">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-foreground text-background">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4 p-2 border border-border rounded-md">
                      <div className="w-16 h-16 bg-secondary/20 rounded-md overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.product.node.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.selectedOptions.map(option => option.value).join(' • ')}
                        </p>
                        <p className="font-semibold text-foreground">
                          {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.variantId)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex-shrink-0 space-y-4 pt-4 border-t bg-background">
                {/* Coupon Selector */}
                <CouponSelector onCouponApplied={() => setCouponCode("")} />

                {/* Manual Coupon Input (Alternative) */}
                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Or enter coupon code"
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
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleRemoveCoupon}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{items[0]?.price.currencyCode || 'INR'} {subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-{items[0]?.price.currencyCode || 'INR'} {discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-xl font-bold text-foreground">
                      {items[0]?.price.currencyCode || 'INR'} {total.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-foreground text-background hover:bg-foreground/90" 
                  size="lg"
                  disabled={items.length === 0}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
