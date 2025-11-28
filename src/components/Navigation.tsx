import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Heart, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useAuthStore } from "@/stores/authStore";
import { CartDrawer } from "./CartDrawer";
import { useState } from "react";

export const Navigation = () => {
  const navigate = useNavigate();
  const items = useCartStore(state => state.items);
  const wishlistItems = useWishlistStore(state => state.items);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [searchQuery, setSearchQuery] = useState("");
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { label: "New Arrivals", href: "/new-arrivals" },
    { label: "Office Wear", href: "/office-wear" },
    { label: "Daily Wear", href: "/daily-wear" },
    { label: "Party Wear", href: "/party-wear" },
    { label: "Date Night", href: "/date-night" },
    { label: "Wedding Wear", href: "/wedding-wear" },
    { label: "Collections", href: "/collections" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      {/* Top row: Logo, Search, Icons */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-foreground hover:text-foreground/80 transition-colors whitespace-nowrap">
              AURORA CADENCE
            </Link>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for your dearest jewelry..."
                  className="w-full pl-10 pr-4 py-5 bg-secondary/30 border-border rounded-full focus:outline-none focus:ring-1 focus:ring-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Icons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-foreground hover:bg-secondary"
                onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
              >
                <User className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-foreground hover:bg-secondary"
                onClick={() => navigate("/wishlist")}
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[10px] bg-foreground text-background">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
              
              <CartDrawer />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row: Navigation Links */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 py-4 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm text-foreground hover:text-foreground/60 transition-colors whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
