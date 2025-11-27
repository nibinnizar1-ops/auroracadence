import { X } from "lucide-react";
import { useState } from "react";

export const OfferBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-black text-white py-2.5 px-4">
      <div className="container mx-auto max-w-4xl flex items-center justify-center gap-4">
        <p className="text-xs sm:text-sm font-medium text-center">
          🎁 Buy 1 Get 1 Free : BUY2 🎁
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
