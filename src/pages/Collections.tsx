import { Navigation } from "@/components/Navigation";
import { FilteredProductGrid } from "@/components/FilteredProductGrid";
import bannerCollection from "@/assets/banner-collection.jpg";
import bannerLuxury from "@/assets/banner-luxury.jpg";

export default function Collections() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Collections</h1>
        <p className="text-muted-foreground mb-12">Explore our curated collections of fine jewelry</p>
        
        <div className="space-y-16">
          <div>
            <img src={bannerCollection} alt="Aurora Cadence Collection" className="w-full h-[300px] object-cover rounded-lg mb-8" />
            <h2 className="text-3xl font-bold text-foreground mb-8">Aurora Collection</h2>
            <FilteredProductGrid />
          </div>
          
          <div>
            <img src={bannerLuxury} alt="Luxury Collection" className="w-full h-[300px] object-cover rounded-lg mb-8" />
            <h2 className="text-3xl font-bold text-foreground mb-8">Luxury Collection</h2>
            <FilteredProductGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
