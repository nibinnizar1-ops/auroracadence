import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductGrid } from "@/components/ProductGrid";
import { HeroBanner } from "@/components/HeroBanner";
import heroImage3 from "@/assets/hero-jewelry-3.jpg";

export default function OfficeWear() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <HeroBanner imageUrl={heroImage3} />
      <div id="products" className="container mx-auto px-4 py-16 flex-grow">
        <ProductGrid category="Office Wear" limit={50} />
      </div>
      <Footer />
    </div>
  );
}
