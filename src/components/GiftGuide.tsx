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
    const radius = 400;

    // Distribute cards in cylindrical layout
    Array.from(cards).forEach((card, i) => {
      const angle = (i / total) * Math.PI * 2;

      (card as HTMLElement).style.transform = `
        rotateX(${(angle * 180) / Math.PI}deg)
        translateZ(${radius}px)
      `;
    });

    // Scroll-based rotation
    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;

      // Only animate when section is in view
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        // Calculate progress: 0 when section enters, 1 when it leaves
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + sectionHeight * 0.5)));
        const rotation = progress * 360 * 1.5; // 1.5 full rotations
        cardsContainer.style.transform = `rotateX(${rotation}deg)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 pt-32 pb-16 text-center relative z-10">
        <Heart className="w-12 h-12 text-accent mx-auto mb-4 animate-pulse" />
        <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
          Timeless Gifts For Every Relationship
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find the perfect piece that speaks to your heart and celebrates your special bond
        </p>
      </div>

      {/* 3D Carousel Scene */}
      <div className="gift-scene sticky top-0 h-[100vh] flex items-center justify-center" style={{ perspective: "1500px" }}>
        <div
          ref={cardsContainerRef}
          className="gift-cards-container relative"
          style={{
            width: "320px",
            height: "480px",
            transformStyle: "preserve-3d",
            transition: "transform 0.15s ease-out",
          }}
        >
          {giftCategories.map((category, index) => (
            <div
              key={category.name}
              className="gift-card absolute inset-0 rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
              style={{
                width: "320px",
                height: "480px",
                backfaceVisibility: "hidden",
                transformOrigin: "center center",
              }}
            >
              <div className="relative w-full h-full group">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-8">
                  <h3 className="text-3xl font-serif text-white group-hover:text-accent transition-colors duration-300">
                    {category.name}
                  </h3>
                </div>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 group-hover:from-white/20 group-hover:via-white/10 group-hover:to-white/0 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-muted-foreground text-sm animate-bounce z-10">
        <p>Scroll to explore</p>
      </div>
    </section>
  );
};
