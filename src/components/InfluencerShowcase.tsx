import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { getActiveInfluencerShowcaseItems } from "@/lib/influencers";

const defaultInfluencers = [
  {
    name: "Aparna Thomas",
    quote: "This design feels so elegant… I love how it completes my look instantly.",
    product_name: "Aurora 18k Gold Layered Necklace",
    product_description: "Minimal, graceful & perfect for elevated everyday styling.",
    instagram_reel_url: "https://www.instagram.com/reel/EXAMPLE1/embed",
    product_price: 4999,
    image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop",
  },
  {
    name: "Thanu",
    quote: "So premium, yet so effortless. It looks beautiful on camera too!",
    product_name: "Swarovski Shine Drop Earrings",
    product_description: "Bright, feminine brilliance for every mood.",
    instagram_reel_url: "https://www.instagram.com/reel/EXAMPLE2/embed",
    product_price: 3499,
    image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop",
  },
  {
    name: "Aziya",
    quote: "I didn't expect it to feel this lightweight. Absolutely love the finish!",
    product_name: "Everyday 18k Gold Hoops",
    product_description: "Soft curves, modern silhouette, zero irritation.",
    instagram_reel_url: "https://www.instagram.com/reel/EXAMPLE3/embed",
    product_price: 2999,
    image_url: "https://images.unsplash.com/photo-1596944924591-4944e34a1f96?w=400&h=500&fit=crop",
  },
  {
    name: "Chippy Devassy",
    quote: "This one's such a vibe!! Stylish, subtle and super classy.",
    product_name: "Celeste Gold Pendant",
    product_description: "Understated, timeless & beautifully crafted.",
    instagram_reel_url: "https://www.instagram.com/reel/EXAMPLE4/embed",
    product_price: 3999,
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop",
  },
  {
    name: "Anjan Sagar",
    quote: "Feels luxury… looks even better in real life.",
    product_name: "Signature 18k Gold Bracelet",
    product_description: "Elegant, chic & made for all-day wear.",
    instagram_reel_url: "https://www.instagram.com/reel/EXAMPLE5/embed",
    product_price: 5499,
    image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=500&fit=crop",
  },
];

export const InfluencerShowcase = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [influencers, setInfluencers] = useState(defaultInfluencers);

  useEffect(() => {
    const loadInfluencers = async () => {
      const data = await getActiveInfluencerShowcaseItems();
      // Merge database items with defaults - use database image if exists, otherwise use default
      // Match by name and position to ensure correct order
      const mergedInfluencers = defaultInfluencers.map((defaultInf, index) => {
        // Try to find by name first, then by position
        const dbItem = data.find(item => item.name === defaultInf.name) || 
                      data.find(item => item.position === index);
        return {
          name: dbItem?.name || defaultInf.name,
          quote: dbItem?.quote || defaultInf.quote,
          product_name: dbItem?.product_name || defaultInf.product_name,
          product_description: dbItem?.product_description || defaultInf.product_description,
          instagram_reel_url: dbItem?.instagram_reel_url || defaultInf.instagram_reel_url,
          product_price: dbItem?.product_price || defaultInf.product_price,
          image_url: dbItem?.image_url || defaultInf.image_url,
        };
      });
      setInfluencers(mergedInfluencers);
    };
    loadInfluencers();
  }, []);

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
                  src={influencer.image_url}
                  alt={`${influencer.name} wearing ${influencer.product_name}`}
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
                        {influencer.product_name}
                      </h4>
                      <p className="text-xs text-white/80 line-clamp-2">
                        {influencer.product_description}
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
                  src={influencer.image_url}
                  alt={`${influencer.name} wearing ${influencer.product_name}`}
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
                        {influencer.product_name}
                      </h4>
                      <p className="text-xs text-white/80 line-clamp-2">
                        {influencer.product_description}
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
