import { useEffect } from "react";
import { Link } from "react-router-dom";
import { OfferBanner } from "@/components/OfferBanner";
import { Navigation } from "@/components/Navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ProductGrid } from "@/components/ProductGrid";
import { Banner } from "@/components/Banner";
import { BannerLuxury } from "@/components/BannerLuxury";
import { CategorySection } from "@/components/CategorySection";
import { GiftGuide } from "@/components/GiftGuide";
import { FilteredProductGrid } from "@/components/FilteredProductGrid";
import { StoreLocations } from "@/components/StoreLocations";
import { InfluencerShowcase } from "@/components/InfluencerShowcase";
import { Footer } from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <OfferBanner />
      <Navigation />
      
      <HeroCarousel />

      <CategoryShowcase />

      <Banner />

      <section id="top-styles" className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-12 uppercase tracking-wide">
            Aurora's TOP STYLES
          </h2>
          <FilteredProductGrid />
        </div>
      </section>

      <CategorySection />

      <section id="new-arrivals" className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Collection
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collection of timeless pieces designed for the modern woman
            </p>
          </div>
          <ProductGrid />
        </div>
      </section>

      <BannerLuxury />

      <GiftGuide />

      <InfluencerShowcase />

      <StoreLocations />

      <Footer />
    </div>
  );
};

export default Index;
