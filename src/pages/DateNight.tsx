import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { HeroBanner } from "@/components/HeroBanner";
import heroImage2 from "@/assets/hero-jewelry-2.jpg";

export default function DateNight() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <HeroBanner imageUrl={heroImage2} />
      <div id="products" className="container mx-auto px-4 py-16 flex-grow">
        <ProductGrid category="Date Night" limit={50} />
      </div>
      <Footer />
    </div>
  );
}
