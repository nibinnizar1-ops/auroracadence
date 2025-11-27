import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { CartDrawer } from "./CartDrawer";

export const Navigation = () => {
  const items = useCartStore(state => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { label: "New Arrivals", href: "#new-arrivals" },
    { label: "Office Wear", href: "#office-wear" },
    { label: "Daily Wear", href: "#daily-wear" },
    { label: "Party Wear", href: "#party-wear" },
    { label: "Date Night", href: "#date-night" },
    { label: "Wedding Wear", href: "#wedding-wear" },
    { label: "Collections", href: "#collections" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-serif text-foreground hover:text-foreground/80 transition-colors">
            Aurora Cadence
          </Link>
          
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-foreground hover:text-foreground/60 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <CartDrawer />
        </div>
      </div>
    </nav>
  );
};
