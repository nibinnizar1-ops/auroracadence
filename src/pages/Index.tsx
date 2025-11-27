import { Navigation } from "@/components/Navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryShowcase } from "@/components/CategoryShowcase";
import { ProductGrid } from "@/components/ProductGrid";
import { Banner } from "@/components/Banner";
import { CategorySection } from "@/components/CategorySection";
import { GiftGuide } from "@/components/GiftGuide";
import { ReviewSection } from "@/components/ReviewSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <HeroCarousel />

      <CategoryShowcase />

      <Banner />

      <section id="new-arrivals" className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              Our Collection
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our curated collection of timeless pieces designed for the modern woman
            </p>
          </div>
          <ProductGrid />
        </div>
      </section>

      <section id="top-styles" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-foreground text-center mb-12">
            Aurora's Top Styles
          </h2>
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <button className="px-6 py-2 border border-foreground text-foreground hover:bg-foreground hover:text-background transition-all rounded-full">
              All
            </button>
            <button className="px-6 py-2 border border-border text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-all rounded-full">
              Necklaces
            </button>
            <button className="px-6 py-2 border border-border text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-all rounded-full">
              Rings
            </button>
            <button className="px-6 py-2 border border-border text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-all rounded-full">
              Earrings
            </button>
            <button className="px-6 py-2 border border-border text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-all rounded-full">
              Bracelets
            </button>
          </div>
          <ProductGrid />
        </div>
      </section>

      <CategorySection />

      <GiftGuide />

      <ReviewSection />

      <footer className="py-12 border-t border-border bg-secondary/20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-serif text-foreground mb-4">Aurora Cadence</h3>
          <p className="text-muted-foreground mb-4">Timeless Elegance, Crafted With Love</p>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
          <p className="text-xs text-muted-foreground mt-8">
            © 2024 Aurora Cadence. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
