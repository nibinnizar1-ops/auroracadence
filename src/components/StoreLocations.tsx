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
    <section className="relative py-20 bg-background overflow-hidden">
      {/* Infinite Carousel */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Try. Love. Take Home.
          </h2>
        </div>

        <div className="carousel-container flex items-center justify-center h-[28rem] overflow-visible">
          <div className="carousel-track">
            {carouselStores.map((store, index) => (
              <div
                key={index}
                className="carousel-item"
                style={
                  {
                    '--i': index + 1,
                    '--total': carouselStores.length,
                  } as React.CSSProperties
                }
              >
                <div className="store-card-carousel bg-card/95 backdrop-blur-sm border border-border rounded-lg overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {store.name}
                    </h3>
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <p className="text-sm text-foreground font-medium">{store.location}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {store.description}
                    </p>
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
