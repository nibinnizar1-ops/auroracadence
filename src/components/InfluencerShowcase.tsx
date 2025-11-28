import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const influencers = [
  {
    name: "Aparna Thomas",
    quote: "This design feels so elegant… I love how it completes my look instantly.",
    product: "Aurora 18k Gold Layered Necklace",
    description: "Minimal, graceful & perfect for elevated everyday styling.",
    instagramReelUrl: "https://www.instagram.com/reel/EXAMPLE1/embed",
    price: 4999,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
  },
  {
    name: "Thanu",
    quote: "So premium, yet so effortless. It looks beautiful on camera too!",
    product: "Swarovski Shine Drop Earrings",
    description: "Bright, feminine brilliance for every mood.",
    instagramReelUrl: "https://www.instagram.com/reel/EXAMPLE2/embed",
    price: 3499,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop",
  },
  {
    name: "Aziya",
    quote: "I didn't expect it to feel this lightweight. Absolutely love the finish!",
    product: "Everyday 18k Gold Hoops",
    description: "Soft curves, modern silhouette, zero irritation.",
    instagramReelUrl: "https://www.instagram.com/reel/EXAMPLE3/embed",
    price: 2999,
    image: "https://images.unsplash.com/photo-1596944924591-4944e34a1f96?w=400&h=500&fit=crop",
  },
  {
    name: "Chippy Devassy",
    quote: "This one's such a vibe!! Stylish, subtle and super classy.",
    product: "Celeste Gold Pendant",
    description: "Understated, timeless & beautifully crafted.",
    instagramReelUrl: "https://www.instagram.com/reel/EXAMPLE4/embed",
    price: 3999,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop",
  },
  {
    name: "Anjan Sagar",
    quote: "Feels luxury… looks even better in real life.",
    product: "Signature 18k Gold Bracelet",
    description: "Elegant, chic & made for all-day wear.",
    instagramReelUrl: "https://www.instagram.com/reel/EXAMPLE5/embed",
    price: 5499,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop",
  },
];

export const InfluencerShowcase = () => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (influencer: typeof influencers[0]) => {
    // For now, we'll show a toast. To fully integrate with Shopify cart,
    // you'll need to connect this to actual Shopify product variants
    toast.success(`${influencer.product} added to wishlist!`);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Worn by Women. Who Inspire Us.
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            See how real women style their Aurora Cadence pieces — from everyday moods to special moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {influencers.map((influencer, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-[4/5] overflow-hidden bg-secondary/20">
                <iframe
                  src={influencer.instagramReelUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency
                  allow="encrypted-media"
                  title={`${influencer.name} Instagram Reel`}
                />
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    🌸 {influencer.name}
                  </h3>
                  <p className="text-muted-foreground italic text-sm mb-4">
                    "{influencer.quote}"
                  </p>
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    She's wearing:
                  </p>
                  <h4 className="font-semibold text-foreground">
                    {influencer.product}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {influencer.description}
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    ₹{influencer.price.toLocaleString()}
                  </p>
                </div>

                <Button
                  onClick={() => handleAddToCart(influencer)}
                  className="w-full"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
