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
    const radius = 500;
    const curvature = 10;

    // Distribute cards in cylindrical layout
    Array.from(cards).reverse().forEach((card, i) => {
      const angle = (i / total) * Math.PI * 2;
      const y = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const tilt = (Math.sin(angle) * curvature).toFixed(2);

      (card as HTMLElement).style.transform = `
        rotateX(${(angle * 180) / Math.PI}deg)
        translateZ(${radius}px)
        rotateY(${tilt}deg)
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
        const scrollProgress = (windowHeight - sectionTop) / (windowHeight + sectionHeight);
        const rotation = scrollProgress * 360;
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
    <section ref={sectionRef} className="relative py-32 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      <div className="container mx-auto px-4 mb-16 text-center relative z-10">
        <Heart className="w-12 h-12 text-accent mx-auto mb-4 animate-pulse" />
        <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
          Timeless Gifts For Every Relationship
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find the perfect piece that speaks to your heart and celebrates your special bond
        </p>
      </div>

      {/* 3D Carousel Scene */}
      <div className="gift-scene sticky top-0 h-[100vh] flex items-center justify-center" style={{ perspective: "1200px" }}>
        <div
          ref={cardsContainerRef}
          className="gift-cards-container relative"
          style={{
            width: "300px",
            height: "450px",
            transformStyle: "preserve-3d",
            transition: "transform 0.1s ease-out",
          }}
        >
          {giftCategories.map((category, index) => (
            <div
              key={category.name}
              className="gift-card absolute inset-0 rounded-3xl overflow-hidden shadow-2xl cursor-pointer"
              style={{
                width: "300px",
                height: "450px",
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-8">
                  <h3 className="text-2xl font-serif text-white group-hover:text-accent transition-colors">
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-muted-foreground text-sm animate-bounce">
        <p>Scroll to explore</p>
      </div>
    </section>
  );
};
