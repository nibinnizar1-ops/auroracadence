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

// Duplicate stores for seamless loop
const carouselImages = [
  ...stores.map(s => s.image),
  "https://plus.unsplash.com/premium_photo-1671105035554-7f8c2a587201?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1686750875748-d00684d36b1e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1686844462591-393ceae12be0?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1686839181367-febb561faa53?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1671199850329-91cae34a6b6d?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1685655611311-9f801b43b9fa?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1675598468920-878ae1e46f14?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1718036094878-ecdce2b1be95?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

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

        <div className="carousel-container flex items-center justify-center h-[30rem] overflow-visible">
          <div className="carousel-track">
            {carouselImages.map((image, index) => (
              <div
                key={index}
                className="carousel-item"
                style={
                  {
                    '--i': index + 1,
                    '--total': carouselImages.length,
                  } as React.CSSProperties
                }
              >
                <img
                  src={image}
                  alt={`Aurora Cadence jewelry ${index + 1}`}
                  className="carousel-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Store Cards */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {stores.map((store, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-lg p-8 hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--gold),0.2)]"
            >
              <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-accent transition-colors">
                {store.name}
              </h3>
              <div className="flex items-start gap-2 mb-4">
                <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <p className="text-foreground font-medium">{store.location}</p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {store.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
