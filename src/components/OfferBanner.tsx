import { X } from "lucide-react";
import { useState } from "react";

export const OfferBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-accent via-primary to-accent text-primary-foreground py-2.5 px-4">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <p className="text-xs sm:text-sm font-medium text-center">
          🎁 Get 50% Worth ₹7,495 On Brand Order Above ₹8999 Total Worth Free 🎁
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
