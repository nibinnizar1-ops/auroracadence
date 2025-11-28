import { MapPin } from "lucide-react";

const stores = [
  {
    name: "Aurora Cadence X He & She",
    location: "Madannada, Kollam",
    description: "A warm, curated space where everyday elegance meets effortless style.",
    image: "https://images.unsplash.com/photo-1758314896569-b3639ee707c4?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Salon de R X Aurora Cadence",
    location: "Polayathode, Kollam",
    description: "A boutique experience blending fashion, beauty and contemporary jewellery.",
    image: "https://plus.unsplash.com/premium_photo-1671649240322-2124cd07eaae?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Rock Paper X Aurora Cadence",
    location: "Polayathode, Kollam",
    description: "Youthful, modern and expressive — perfect for trend-led, stylish finds.",
    image: "https://plus.unsplash.com/premium_photo-1673029925648-af80569efc46?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Go Girl X Aurora Cadence",
    location: "Trivandrum / Kollam",
    description: "A chic destination crafted for women who love sparkle, confidence and self-expression.",
    image: "https://plus.unsplash.com/premium_photo-1666533099824-abd0ed813f2a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
];

// Duplicate stores for seamless loop (3 times for smooth infinite scroll)
const carouselStores = [...stores, ...stores, ...stores];

export const StoreLocations = () => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden">
      {/* Infinite Carousel */}
      <div className="mb-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
            Try. Love. Take Home.
          </h2>
        </div>

        <div className="store-carousel-container">
          <div className="store-carousel-track">
            {carouselStores.map((store, index) => (
              <div
                key={index}
                className="store-carousel-item"
                style={
                  {
                    '--i': index + 1,
                    '--total': carouselStores.length,
                  } as React.CSSProperties
                }
              >
                <div className="store-location-card">
                  {/* Image Background */}
                  <div className="absolute inset-0 overflow-hidden">
                    <img 
                      src={store.image} 
                      alt={store.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center text-center p-6 z-10">
                    <div className="space-y-3">
                      <h3 className="text-white text-xl font-bold tracking-wide leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] mb-3">
                        {store.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-accent drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
                        <p className="text-white text-sm font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                          {store.location}
                        </p>
                      </div>
                      <p className="text-white/90 text-sm leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] max-w-[280px] mx-auto">
                        {store.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
