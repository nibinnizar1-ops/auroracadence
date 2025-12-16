import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tag, 
  Image, 
  Settings,
  ArrowLeft,
  RotateCcw,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/products", label: "Products", icon: Package },
  { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { path: "/admin/payments", label: "Payments", icon: CreditCard },
  { path: "/admin/returns", label: "Returns", icon: RotateCcw },
  { path: "/admin/coupons", label: "Coupons", icon: Tag },
  // Settings deferred - product types/categories management will be added later
  // { path: "/admin/settings", label: "Settings", icon: Settings },
];

// Media management items - ordered to match website order
// Website order: Hero → Category Showcase → Collection Banner → Luxury Moods → Luxury Banner → Gift Guide → Influencers → Stores
const mediaNavItems = [
  { path: "/admin/banners", label: "Banners", icon: Image, description: "Hero, Collection & Luxury Banners" },
  { path: "/admin/category-showcase", label: "Category Showcase", icon: Image, description: "EVERYDAY LUXURY JEWELLERY" },
  { path: "/admin/luxury-moods", label: "Luxury Moods", icon: Image, description: "LUXURY MOODS Carousel" },
  { path: "/admin/gift-guide", label: "Gift Guide", icon: Image, description: "Timeless Gifts For Every Relationship" },
  { path: "/admin/influencers", label: "Influencers", icon: Image, description: "Worn by Women. Who Inspire Us." },
  { path: "/admin/stores", label: "Stores", icon: Image, description: "Try Love. Take Home." },
];


export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="border-b border-border p-6">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Aurora Cadence</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path !== "/admin" && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            
            {/* Media Management Section - Always Visible */}
            <div className="pt-4 mt-4 border-t border-border">
              <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Media Management</p>
              {mediaNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || 
                  location.pathname.startsWith(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ml-2",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    title={item.description}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Site
              </Link>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};



