import { Navigation } from "@/components/Navigation";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-8">About Aurora Cadence</h1>
        
        <div className="max-w-3xl space-y-6 text-muted-foreground">
          <p className="text-lg">
            Aurora Cadence represents the pinnacle of luxury jewelry craftsmanship. Since our founding, we've been dedicated to creating timeless pieces that celebrate life's most precious moments.
          </p>
          
          <p>
            Our collection features meticulously crafted jewelry that combines traditional artistry with contemporary design. Each piece is created with the finest materials and attention to detail that has become our hallmark.
          </p>
          
          <p>
            From engagement rings to everyday elegance, Aurora Cadence offers jewelry for every occasion and every relationship. We believe that jewelry is more than an accessory—it's a reflection of your unique story and style.
          </p>
          
          <div className="pt-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Values</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="font-semibold text-foreground mr-2">Quality:</span>
                <span>We use only the finest materials and maintain strict quality standards.</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-foreground mr-2">Craftsmanship:</span>
                <span>Each piece is crafted by skilled artisans with years of experience.</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-foreground mr-2">Sustainability:</span>
                <span>We're committed to ethical sourcing and sustainable practices.</span>
              </li>
              <li className="flex items-start">
                <span className="font-semibold text-foreground mr-2">Customer Service:</span>
                <span>Your satisfaction is our priority, from selection to after-care.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
