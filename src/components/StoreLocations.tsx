import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stores = [
  {
    name: "Aurora Cadence X He & She",
    location: "Madannada, Kollam",
    description: "A warm, curated space where everyday elegance meets effortless style.",
    year: "Est. 2020",
  },
  {
    name: "Salon de R X Aurora Cadence",
    location: "Polayathode, Kollam",
    description: "A boutique experience blending fashion, beauty and contemporary jewellery.",
    year: "Est. 2021",
  },
  {
    name: "Rock Paper X Aurora Cadence",
    location: "Polayathode, Kollam",
    description: "Youthful, modern and expressive — perfect for trend-led, stylish finds.",
    year: "Est. 2022",
  },
  {
    name: "Go Girl X Aurora Cadence",
    location: "Trivandrum / Kollam",
    description: "A chic destination crafted for women who love sparkle, confidence and self-expression.",
    year: "Est. 2023",
  },
];

export const StoreLocations = () => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute("data-index") || "0");
          setVisibleItems((prev) => {
            const newSet = new Set(prev);
            if (entry.isIntersecting) {
              newSet.add(index);
            } else {
              newSet.delete(index);
            }
            return newSet;
          });
        });
      },
      {
        threshold: 0.5,
      }
    );

    itemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-secondary/10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Try. Love. Take Home.
          </h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <ul className="timeline-list relative">
            {stores.map((store, index) => (
              <li
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                data-index={index}
                className={`timeline-item relative w-[6px] mx-auto pt-12 pb-0 bg-border first:pt-0 last:after:hidden after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:-translate-x-1/2 after:rotate-45 after:w-5 after:h-5 after:z-[2] after:bg-secondary/30 ${
                  visibleItems.has(index) ? "in-view" : ""
                }`}
              >
                <div
                  className={`timeline-content absolute bottom-0 w-[90vw] md:w-[400px] p-6 bg-card shadow-elegant rounded-lg flex flex-col gap-4 transition-all duration-500 ease-in-out ${
                    visibleItems.has(index)
                      ? "opacity-100 visible translate-x-0 translate-y-0 rotate-0"
                      : "opacity-0 invisible"
                  } ${
                    index % 2 === 0
                      ? "md:left-[45px] left-[20px] md:translate-x-[100px] md:-translate-y-[10px] md:rotate-[10deg]"
                      : "md:left-[-445px] left-[20px] md:-translate-x-[100px] md:-translate-y-[10px] md:rotate-[10deg]"
                  } ${visibleItems.has(index) ? "" : "md:translate-x-0 md:translate-y-0 md:rotate-0"}`}
                >
                  <time className="absolute -top-4 left-5 bg-gradient-to-r from-accent to-gold-dark text-accent-foreground w-24 h-8 rounded-md flex justify-center items-center text-sm font-semibold tracking-wide shadow-md">
                    {store.year}
                  </time>

                  <div className="pt-4">
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {store.name}
                    </h3>
                    
                    <div className="flex items-start gap-2 mb-3">
                      <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                      <p className="text-foreground font-medium">{store.location}</p>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed text-center">
                      {store.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="h-12" />
      </div>
    </section>
  );
};
