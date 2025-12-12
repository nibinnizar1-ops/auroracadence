import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollSpeed = 0.5; // Adjust speed (pixels per frame)
    const scrollDirection = 1; // 1 for right, -1 for left

    const animate = () => {
      if (scrollContainer) {
        scrollAmount += scrollSpeed * scrollDirection;
        scrollContainer.scrollLeft = scrollAmount;

        // Reset scroll position when reaching the end
        if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollAmount = 0;
        }
      }
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

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

        <div className="overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollBehavior: 'auto',
            }}
          >
            {influencers.map((influencer, index) => (
              <Card
                key={index}
                className="min-w-[320px] max-w-[320px] h-[500px] overflow-hidden hover:shadow-xl transition-shadow flex-shrink-0 relative"
              >
                {/* Full card background image */}
                <img
                  src={influencer.image}
                  alt={`${influencer.name} wearing ${influencer.product}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                
                {/* Content overlay */}
                <div className="relative h-full flex flex-col justify-end p-4 text-white z-10">
                  <div className="space-y-3 text-center">
                    <div>
                      <h3 className="text-base font-semibold text-white mb-1">
                        {influencer.name}
                      </h3>
                      <p className="text-white/90 italic text-xs mb-3 line-clamp-2">
                        "{influencer.quote}"
                      </p>
                    </div>

                    <div className="border-t border-white/20 pt-3 space-y-1.5 text-center">
                      <p className="text-xs text-white/80 uppercase tracking-wider">
                        She's wearing:
                      </p>
                      <h4 className="font-semibold text-white text-sm">
                        {influencer.product}
                      </h4>
                      <p className="text-xs text-white/80 line-clamp-2">
                        {influencer.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {/* Duplicate cards for seamless loop */}
            {influencers.map((influencer, index) => (
              <Card
                key={`duplicate-${index}`}
                className="min-w-[320px] max-w-[320px] h-[500px] overflow-hidden hover:shadow-xl transition-shadow flex-shrink-0 relative"
              >
                {/* Full card background image */}
                <img
                  src={influencer.image}
                  alt={`${influencer.name} wearing ${influencer.product}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
                
                {/* Content overlay */}
                <div className="relative h-full flex flex-col justify-end p-4 text-white z-10">
                  <div className="space-y-3 text-center">
                    <div>
                      <h3 className="text-base font-semibold text-white mb-1">
                        {influencer.name}
                      </h3>
                      <p className="text-white/90 italic text-xs mb-3 line-clamp-2">
                        "{influencer.quote}"
                      </p>
                    </div>

                    <div className="border-t border-white/20 pt-3 space-y-1.5 text-center">
                      <p className="text-xs text-white/80 uppercase tracking-wider">
                        She's wearing:
                      </p>
                      <h4 className="font-semibold text-white text-sm">
                        {influencer.product}
                      </h4>
                      <p className="text-xs text-white/80 line-clamp-2">
                        {influencer.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
};
