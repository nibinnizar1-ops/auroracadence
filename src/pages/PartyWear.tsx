import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { HeroBanner } from "@/components/HeroBanner";
import heroImage1 from "@/assets/hero-jewelry-1.jpg";

export default function PartyWear() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <HeroBanner imageUrl={heroImage1} />
      <div id="products" className="container mx-auto px-4 py-16 flex-grow">
        <ProductGrid />
      </div>
      <Footer />
    </div>
  );
}
