import { MapPin } from "lucide-react";

const stores = [
  {
    name: "Aurora Cadence X He & She",
    location: "Madannada, Kollam",
    description: "A warm, curated space where everyday elegance meets effortless style.",
  },
  {
    name: "Salon de R X Aurora Cadence",
    location: "Polayathode, Kollam",
    description: "A boutique experience blending fashion, beauty and contemporary jewellery.",
  },
  {
    name: "Rock Paper X Aurora Cadence",
    location: "Polayathode, Kollam",
    description: "Youthful, modern and expressive — perfect for trend-led, stylish finds.",
  },
  {
    name: "Go Girl X Aurora Cadence",
    location: "Trivandrum / Kollam",
    description: "A chic destination crafted for women who love sparkle, confidence and self-expression.",
  },
];

export const StoreLocations = () => {
  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Try. Love. Take Home.
          </h2>
        </div>

        <div className="flex flex-col gap-14 max-w-xl mx-auto">
          {stores.map((store, index) => (
            <div
              key={index}
              className="sticky top-8"
              style={{
                animation: `rotate-scroll-${index + 1} linear`,
                animationTimeline: 'scroll()',
              }}
            >
              <div className="bg-card border border-border rounded-lg p-8 shadow-[0_0_1.25rem_rgba(0,0,0,0.15)] hover:shadow-[0_0_2rem_rgba(0,0,0,0.25)] transition-shadow">
                <h3 className="text-xl font-semibold text-foreground mb-3">
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
            </div>
          ))}
          <div className="h-32" />
        </div>
      </div>
    </section>
  );
};
