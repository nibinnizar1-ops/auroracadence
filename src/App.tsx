import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { PageWrapper } from "@/components/PageWrapper";
import { SwipeBackHandler } from "@/components/SwipeBackHandler";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";
import NewArrivals from "./pages/NewArrivals";
import OfficeWear from "./pages/OfficeWear";
import DailyWear from "./pages/DailyWear";
import PartyWear from "./pages/PartyWear";
import DateNight from "./pages/DateNight";
import WeddingWear from "./pages/WeddingWear";
import Collections from "./pages/Collections";
import About from "./pages/About";
import Contact from "./pages/Contact";
import TermsAndConditions from "./pages/TermsAndConditions";
import RefundPolicy from "./pages/RefundPolicy";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import AuthCallback from "./pages/AuthCallback";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminReturns from "./pages/admin/Returns";
import AdminReturnDetail from "./pages/admin/ReturnDetail";
import AdminProducts from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import ProductPreview from "./pages/admin/ProductPreview";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import AdminPayments from "./pages/admin/Payments";
import AdminPaymentGateways from "./pages/admin/PaymentGateways";
import PaymentGatewayForm from "./pages/admin/PaymentGatewayForm";
import AdminCoupons from "./pages/admin/Coupons";
import CouponForm from "./pages/admin/CouponForm";
import AdminBanners from "./pages/admin/media/Banners";
import BannerForm from "./pages/admin/media/BannerForm";
import CategoryShowcase from "./pages/admin/media/CategoryShowcase";
import CategoryShowcaseForm from "./pages/admin/media/CategoryShowcaseForm";
import LuxuryMoods from "./pages/admin/media/LuxuryMoods";
import LuxuryMoodsForm from "./pages/admin/media/LuxuryMoodsForm";
import GiftGuide from "./pages/admin/media/GiftGuide";
import GiftGuideForm from "./pages/admin/media/GiftGuideForm";
import Influencers from "./pages/admin/media/Influencers";
import InfluencerForm from "./pages/admin/media/InfluencerForm";
import Stores from "./pages/admin/media/Stores";
import StoreForm from "./pages/admin/media/StoreForm";
import Settings from "./pages/admin/Settings";
// Social Media management skipped - links stored in frontend Footer component
// import SocialMedia from "./pages/admin/SocialMedia";

const queryClient = new QueryClient();

const AppContent = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize auth state when app loads
    initializeAuth();

    // Ensure browser navigation (trackpad swipes) works with React Router
    // React Router's BrowserRouter handles this, but we ensure it's working
    const handlePopState = (event: PopStateEvent) => {
      // This event fires when user uses browser back/forward or trackpad swipe
      // React Router's BrowserRouter should handle this automatically
      // We just ensure the event isn't blocked
    };

    // Add listener for browser navigation events (including trackpad swipes)
    window.addEventListener("popstate", handlePopState, { passive: true });

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [initializeAuth]);

  return (
        <>
          <SwipeBackHandler />
          <PageWrapper>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:handle" element={<ProductDetail />} />
              <Route path="/new-arrivals" element={<NewArrivals />} />
              <Route path="/office-wear" element={<OfficeWear />} />
              <Route path="/daily-wear" element={<DailyWear />} />
              <Route path="/party-wear" element={<PartyWear />} />
              <Route path="/date-night" element={<DateNight />} />
              <Route path="/wedding-wear" element={<WeddingWear />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<ProductForm />} />
              <Route path="/admin/products/:id/edit" element={<ProductForm />} />
              <Route path="/admin/products/:id/preview" element={<ProductPreview />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/payments/gateways" element={<AdminPaymentGateways />} />
              <Route path="/admin/payments/gateways/:id/configure" element={<PaymentGatewayForm />} />
              <Route path="/admin/returns" element={<AdminReturns />} />
              <Route path="/admin/returns/:id" element={<AdminReturnDetail />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/coupons/new" element={<CouponForm />} />
              <Route path="/admin/coupons/:id/edit" element={<CouponForm />} />
              <Route path="/admin/banners" element={<AdminBanners />} />
              <Route path="/admin/banners/new" element={<BannerForm />} />
              <Route path="/admin/banners/:id/edit" element={<BannerForm />} />
              <Route path="/admin/category-showcase" element={<CategoryShowcase />} />
              <Route path="/admin/category-showcase/new" element={<CategoryShowcaseForm />} />
              <Route path="/admin/category-showcase/:id/edit" element={<CategoryShowcaseForm />} />
              <Route path="/admin/luxury-moods" element={<LuxuryMoods />} />
              <Route path="/admin/luxury-moods/new" element={<LuxuryMoodsForm />} />
              <Route path="/admin/luxury-moods/:id/edit" element={<LuxuryMoodsForm />} />
              <Route path="/admin/gift-guide" element={<GiftGuide />} />
              <Route path="/admin/gift-guide/new" element={<GiftGuideForm />} />
              <Route path="/admin/gift-guide/:id/edit" element={<GiftGuideForm />} />
              <Route path="/admin/influencers" element={<Influencers />} />
              <Route path="/admin/influencers/new" element={<InfluencerForm />} />
              <Route path="/admin/influencers/:id/edit" element={<InfluencerForm />} />
              <Route path="/admin/stores" element={<Stores />} />
              <Route path="/admin/stores/new" element={<StoreForm />} />
              <Route path="/admin/stores/:id/edit" element={<StoreForm />} />
              {/* Settings page deferred - product types/categories management will be added later */}
              {/* <Route path="/admin/settings" element={<Settings />} /> */}
              {/* Social Media management skipped - links stored in frontend Footer component */}
              {/* <Route path="/admin/social-media" element={<SocialMedia />} /> */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageWrapper>
        </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
