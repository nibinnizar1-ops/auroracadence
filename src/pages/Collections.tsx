import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { FilteredProductGrid } from "@/components/FilteredProductGrid";
import { HeroBanner } from "@/components/HeroBanner";
import bannerLuxury from "@/assets/banner-luxury.jpg";
import heroImage1 from "@/assets/hero-jewelry-1.jpg";

export default function Collections() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <HeroBanner imageUrl={heroImage1} />
      <div id="collections" className="container mx-auto px-4 py-16 flex-grow">
        <div className="space-y-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Aurora Collection</h2>
            <FilteredProductGrid />
          </div>
          
          <div>
            <img src={bannerLuxury} alt="Luxury Collection" className="w-full h-[300px] object-cover rounded-lg mb-8" />
            <h2 className="text-3xl font-bold text-foreground mb-8">Luxury Collection</h2>
            <FilteredProductGrid />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
