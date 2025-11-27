import { Navigation } from "@/components/Navigation";
import { ProductGrid } from "@/components/ProductGrid";

export default function OfficeWear() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">Office Wear</h1>
        <p className="text-muted-foreground mb-12">Professional & elegant jewelry for your workplace</p>
        <ProductGrid />
      </div>
    </div>
  );
}
