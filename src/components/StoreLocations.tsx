import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { getActiveStoreLocations } from "@/lib/stores";
import bannerCollection from "@/assets/banner-collection.jpg";
import bannerLuxury from "@/assets/banner-luxury.jpg";
import heroJewelry1 from "@/assets/hero-jewelry-1.jpg";
import heroJewelry2 from "@/assets/hero-jewelry-2.jpg";

const defaultStores = [
  {
    name: "He & She",
    location: "Madannada, Kollam",
    description: "A warm, curated space where everyday elegance meets effortless style.",
    image_url: bannerCollection,
  },
  {
    name: "Salon de R",
    location: "Polayathode, Kollam",
    description: "A boutique experience blending fashion, beauty and contemporary jewellery.",
    image_url: bannerLuxury,
  },
  {
    name: "Rock Paper",
    location: "Polayathode, Kollam",
    description: "Youthful, modern and expressive — perfect for trend-led, stylish finds.",
    image_url: heroJewelry1,
  },
  {
    name: "Go Girl",
    location: "Trivandrum / Kollam",
    description: "A chic destination crafted for women who love sparkle, confidence and self-expression.",
    image_url: heroJewelry2,
  },
];

export const StoreLocations = () => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [stores, setStores] = useState(defaultStores);

  useEffect(() => {
    const loadStores = async () => {
      const data = await getActiveStoreLocations();
      // Merge database items with defaults - use database image if exists, otherwise use default
      const mergedStores = defaultStores.map((defaultStore, index) => {
        // Try to find by name first, then by position
        const dbItem = data.find(item => item.name === defaultStore.name) ||
                      data.find(item => item.position === index);
        return {
          name: dbItem?.name || defaultStore.name,
          location: dbItem?.location || defaultStore.location,
          description: dbItem?.description || defaultStore.description,
          image_url: dbItem?.image_url || defaultStore.image_url,
        };
      });
      setStores(mergedStores);
    };
    loadStores();
  }, []);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Try Love. Take Home.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {stores.map((store, index) => (
            <div key={index} className={`store-card-container h-80 ${isScrolling ? 'disable-flip' : ''}`}>
              <div className="store-card">
                {/* Front of card */}
                <div className="store-card-front">
                  <img 
                    src={store.image_url} 
                    alt={store.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
                  <div className="relative h-full flex flex-col items-center justify-center text-center p-6 z-10">
                    <div className="space-y-3">
                      <p className="text-white text-sm font-light tracking-[0.25em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        Aurora Cadence X
                      </p>
                      <h3 className="text-white text-3xl font-bold tracking-wide leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                        {store.name.toUpperCase()}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Back of card */}
                <div className="store-card-back">
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-card">
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {store.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <MapPin className="w-5 h-5 text-accent flex-shrink-0" />
                      <p className="text-foreground font-medium">{store.location}</p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {store.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .store-card-container {
          perspective: 1000px;
        }

        .store-card {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
          cursor: pointer;
        }

        .store-card-container:hover .store-card {
          transform: rotateY(180deg);
        }

        .store-card-container.disable-flip .store-card {
          transform: none !important;
        }

        .store-card-front,
        .store-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .store-card-back {
          transform: rotateY(180deg);
          border: 1px solid hsl(var(--border));
        }
      `}</style>
    </section>
  );
};
