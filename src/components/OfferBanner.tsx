import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getAvailableCoupons, type AvailableCoupon } from "@/lib/coupons";

export const OfferBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [coupons, setCoupons] = useState<AvailableCoupon[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch available coupons on mount
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);
        // This function already filters: is_active=true, is_paused=false, valid dates
        const availableCoupons = await getAvailableCoupons();
        setCoupons(availableCoupons);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Auto-rotate coupons every 4 seconds
  useEffect(() => {
    if (coupons.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % coupons.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [coupons.length]);

  // Don't show banner if no coupons or user closed it
  if (!isVisible || loading || coupons.length === 0) return null;

  const currentCoupon = coupons[currentIndex];

  const formatDiscount = (coupon: AvailableCoupon) => {
    if (coupon.discount_type === 'percentage') {
      return `${coupon.discount_value}% OFF`;
    } else {
      return `₹${coupon.discount_value} OFF`;
    }
  };

  const nextCoupon = () => {
    setCurrentIndex((prev) => (prev + 1) % coupons.length);
  };

  const prevCoupon = () => {
    setCurrentIndex((prev) => (prev - 1 + coupons.length) % coupons.length);
  };

  return (
    <div className="relative w-full bg-black text-white py-2.5 px-4">
      <div className="container mx-auto max-w-4xl flex items-center justify-center gap-4">
        {/* Previous button (only show if multiple coupons) */}
        {coupons.length > 1 && (
          <button
            onClick={prevCoupon}
            className="absolute left-4 p-1 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Previous coupon"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        {/* Coupon Display */}
        <div className="flex-1 text-center">
          <p className="text-xs sm:text-sm font-medium">
            🎁 {currentCoupon.name || formatDiscount(currentCoupon)} : <span className="font-bold">{currentCoupon.code}</span> 🎁
          </p>
        </div>

        {/* Next button (only show if multiple coupons) */}
        {coupons.length > 1 && (
          <button
            onClick={nextCoupon}
            className="absolute right-12 p-1 hover:bg-white/20 rounded-full transition-colors z-10"
            aria-label="Next coupon"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Dots indicator (only show if multiple coupons) */}
        {coupons.length > 1 && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {coupons.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/40'
                }`}
                aria-label={`Go to coupon ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
