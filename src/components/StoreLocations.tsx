import { MapPin, Sparkles } from "lucide-react";

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
    <section className="relative py-24 bg-background overflow-hidden">
      {/* Decorative background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-secondary/10 to-secondary/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
            <span className="text-sm font-medium tracking-widest text-muted-foreground uppercase">
              Visit Our Stores
            </span>
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
            Try. Love. Take Home.
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {stores.map((store, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                    {store.name}
                  </h3>
                  <div className="p-2 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                </div>
                
                <div className="flex items-start gap-2 mb-4 text-foreground/80 font-medium">
                  <span className="inline-block w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0" />
                  <p>{store.location}</p>
                </div>
                
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors">
                  {store.description}
                </p>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-accent/5 rounded-tl-full group-hover:scale-110 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
            <span className="text-sm tracking-wider">Explore More</span>
            <span className="text-2xl">↓</span>
          </div>
        </div>
      </div>
    </section>
  );
};
