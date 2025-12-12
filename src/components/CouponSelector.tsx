import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Check, Loader2 } from "lucide-react";
import { getAvailableCoupons, AvailableCoupon, validateCoupon } from "@/lib/coupons";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

interface CouponSelectorProps {
  onCouponApplied?: () => void;
  className?: string;
}

export const CouponSelector = ({ onCouponApplied, className }: CouponSelectorProps) => {
  const [coupons, setCoupons] = useState<AvailableCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingCoupon, setApplyingCoupon] = useState<string | null>(null);
  const { appliedCoupon, applyCoupon, getSubtotal } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      const availableCoupons = await getAvailableCoupons();
      setCoupons(availableCoupons);
      setLoading(false);
    };

    fetchCoupons();
  }, []);

  const handleApplyCoupon = async (coupon: AvailableCoupon) => {
    if (applyingCoupon) return;

    setApplyingCoupon(coupon.id);
    try {
      const subtotal = getSubtotal();
      const result = await applyCoupon(coupon.code, user?.id);
      
      if (result.valid) {
        toast.success(`Coupon "${coupon.code}" applied! You saved ₹${result.discount.toFixed(2)}`);
        onCouponApplied?.();
      } else {
        toast.error(result.error || "Cannot apply this coupon");
      }
    } catch (error) {
      toast.error("Failed to apply coupon");
    } finally {
      setApplyingCoupon(null);
    }
  };

  const formatDiscount = (coupon: AvailableCoupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    } else {
      return `₹${coupon.discount_value} OFF`;
    }
  };

  const formatMinimumOrder = (minAmount: number | null) => {
    if (!minAmount) return null;
    return `Min. order ₹${minAmount}`;
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Available Coupons</span>
        </div>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return null; // Don't show anything if no coupons available
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Available Coupons</span>
      </div>
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {coupons.map((coupon) => {
          const isApplied = appliedCoupon?.code === coupon.code;
          const isApplying = applyingCoupon === coupon.id;
          const subtotal = getSubtotal();
          const canApply = !coupon.minimum_order_amount || subtotal >= coupon.minimum_order_amount;

          return (
            <Card
              key={coupon.id}
              className={`cursor-pointer transition-all hover:border-primary ${
                isApplied ? 'border-primary bg-primary/5' : ''
              } ${!canApply ? 'opacity-60' : ''}`}
              onClick={() => !isApplied && canApply && handleApplyCoupon(coupon)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{coupon.code}</span>
                      <Badge variant="secondary" className="text-xs">
                        {formatDiscount(coupon)}
                      </Badge>
                      {isApplied && (
                        <Badge variant="default" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Applied
                        </Badge>
                      )}
                    </div>
                    {coupon.name && (
                      <p className="text-xs font-medium text-foreground mb-1">
                        {coupon.name}
                      </p>
                    )}
                    {coupon.description && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {coupon.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      {formatMinimumOrder(coupon.minimum_order_amount) && (
                        <span className="text-xs text-muted-foreground">
                          {formatMinimumOrder(coupon.minimum_order_amount)}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        Valid until {new Date(coupon.valid_until).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {!isApplied && canApply && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyCoupon(coupon);
                      }}
                      disabled={isApplying}
                      className="flex-shrink-0"
                    >
                      {isApplying ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

