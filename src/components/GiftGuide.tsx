import { useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import giftWife from "@/assets/gift-wife.jpg";
import giftGirlfriend from "@/assets/gift-girlfriend.jpg";
import giftMom from "@/assets/gift-mom.jpg";
import giftSister from "@/assets/gift-sister.jpg";

const giftCategories = [
  { name: "For Your Wife", image: giftWife },
  { name: "For Your Girlfriend", image: giftGirlfriend },
  { name: "For Your Mom", image: giftMom },
  { name: "For Your Sister", image: giftSister },
];

export const GiftGuide = () => {
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cardsContainer = cardsContainerRef.current;
    const section = sectionRef.current;
    if (!cardsContainer || !section) return;

    const cards = cardsContainer.querySelectorAll(".gift-card");
    const total = cards.length;
    const radius = 350;

    // Distribute cards in a horizontal circular layout
    Array.from(cards).forEach((card, i) => {
      const angle = (i / total) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius - radius;
      const rotateY = -(angle * 180) / Math.PI;

      (card as HTMLElement).style.transform = `
        translateX(${x}px)
        translateZ(${z}px)
        rotateY(${rotateY}deg)
      `;
    });

    // Scroll-based rotation
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate scroll progress within the section
      if (sectionTop < windowHeight && sectionTop + sectionHeight > 0) {
        const scrollProgress = Math.max(0, Math.min(1, 
          (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5)
        ));
        const rotation = scrollProgress * 360 * 1.5;
        cardsContainer.style.transform = `rotateY(${rotation}deg)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden min-h-[120vh]">
      <div className="container mx-auto px-4 mb-12 text-center relative z-10">
        <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
          Timeless Gifts For Every Relationship
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
          Find the perfect piece that speaks to your heart and celebrates your special bond
        </p>
      </div>

      {/* 3D Carousel Scene */}
      <div className="gift-scene h-[70vh] flex items-center justify-center" style={{ perspective: "2000px" }}>
        <div
          ref={cardsContainerRef}
          className="gift-cards-container relative"
          style={{
            width: "280px",
            height: "400px",
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out",
          }}
        >
          {giftCategories.map((category) => (
            <div
              key={category.name}
              className="gift-card absolute left-0 top-0 rounded-2xl overflow-hidden cursor-pointer"
              style={{
                width: "280px",
                height: "400px",
                backfaceVisibility: "hidden",
                transformOrigin: "center center",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
            >
              <div className="relative w-full h-full group">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl md:text-2xl font-serif text-white drop-shadow-lg group-hover:text-accent transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
                {/* Border shine effect */}
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-accent/50 rounded-2xl transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="text-center text-muted-foreground text-xs md:text-sm mt-8">
        <p className="animate-pulse">Scroll to rotate and explore</p>
      </div>
    </section>
  );
};
