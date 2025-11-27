import { useState, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import realWife from "@/assets/real-wife.jpg";
import realGirlfriend from "@/assets/real-girlfriend.jpg";
import realMom from "@/assets/real-mom.jpg";
import realSister from "@/assets/real-sister.jpg";
import realDaughter from "@/assets/real-daughter.jpg";
import realFriend from "@/assets/real-friend.jpg";
import giftWife from "@/assets/gift-wife.jpg";
import giftGirlfriend from "@/assets/gift-girlfriend.jpg";
import giftMom from "@/assets/gift-mom.jpg";
import giftSister from "@/assets/gift-sister.jpg";
import giftDaughter from "@/assets/gift-daughter.jpg";
import giftFriend from "@/assets/gift-friend.jpg";

const giftCategories = [
  { name: "WIFE", label: "Gifts for", illustration: realWife, jewelry: giftWife },
  { name: "GIRLFRIEND", label: "Gifts for", illustration: realGirlfriend, jewelry: giftGirlfriend },
  { name: "MOM", label: "Gifts for", illustration: realMom, jewelry: giftMom },
  { name: "SISTER", label: "Gifts for", illustration: realSister, jewelry: giftSister },
  { name: "DAUGHTER", label: "Gifts for", illustration: realDaughter, jewelry: giftDaughter },
  { name: "BEST FRIEND", label: "Gifts for", illustration: realFriend, jewelry: giftFriend },
];

export const GiftGuide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalCards = giftCategories.length;

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalCards);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalCards, isPaused]);

  const getCardClass = (index: number) => {
    const diff = (index - currentIndex + totalCards) % totalCards;
    const reverseDiff = (currentIndex - index + totalCards) % totalCards;
    
    if (diff === 0) return "active";
    if (reverseDiff === 1) return "prev-1";
    if (diff === 1) return "next-1";
    if (reverseDiff === 2) return "prev-2";
    if (diff === 2) return "next-2";
    if (reverseDiff === 3) return "prev-3";
    if (diff === 3) return "next-3";
    return "hidden-card";
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalCards);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-secondary/30 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-4xl font-serif text-foreground mb-4">
            Timeless Gifts For Every Relationship
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect piece that speaks to your heart and celebrates your special bond
          </p>
        </div>

        <div className="relative flex items-center justify-center min-h-[500px]">
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-background/80 hover:bg-background border border-border hover:border-foreground transition-all shadow-lg"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div 
            className="relative w-full max-w-[340px] h-[420px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {giftCategories.map((category, index) => (
              <div
                key={category.name}
                className={`gift-card ${getCardClass(index)} absolute left-1/2 top-1/2 w-[340px] h-[420px] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out`}
              >
                <div className="relative h-full">
                  {/* Main card with illustration */}
                  <div className="relative h-full bg-gradient-to-br from-[#f5e6e8] to-[#e8d5d3] rounded-3xl overflow-hidden border-4 border-[#d4b5a7] shadow-2xl">
                    <img 
                      src={category.illustration} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Text overlay at bottom with enhanced visibility */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                      <div className="backdrop-blur-[2px] rounded-lg p-2">
                        <p className="text-white text-xs font-light tracking-[0.3em] uppercase mb-2 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {category.label}
                        </p>
                        <h3 className="text-white text-3xl font-serif italic font-bold text-center tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-background/80 hover:bg-background border border-border hover:border-foreground transition-all shadow-lg"
            aria-label="Next card"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <style>{`
        .gift-card {
          pointer-events: none;
          transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .gift-card.active {
          opacity: 1;
          z-index: 20;
          transform: translate(-50%, -50%) translateX(0) rotate(0deg) translateY(0) scale(1);
          filter: blur(0) brightness(1);
          pointer-events: auto;
        }

        .gift-card.active:hover {
          transform: translate(-50%, -50%) translateX(0) rotate(0deg) translateY(0) scale(1.05);
          filter: blur(0) brightness(1.1);
          box-shadow: 0 20px 60px -10px rgba(0, 0, 0, 0.4);
        }

        .gift-card.prev-1,
        .gift-card.next-1 {
          opacity: 0.7;
          z-index: 10;
          filter: blur(1.5px) brightness(0.9);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .gift-card.prev-1 {
          transform: translate(-50%, -50%) translateX(-280px) rotate(-11deg) translateY(40px) scale(0.85);
        }

        .gift-card.next-1 {
          transform: translate(-50%, -50%) translateX(280px) rotate(11deg) translateY(40px) scale(0.85);
        }

        .gift-card.prev-2,
        .gift-card.next-2 {
          opacity: 0.4;
          z-index: 5;
          filter: blur(3px) brightness(0.8);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .gift-card.prev-2 {
          transform: translate(-50%, -50%) translateX(-520px) rotate(-18deg) translateY(100px) scale(0.7);
        }

        .gift-card.next-2 {
          transform: translate(-50%, -50%) translateX(520px) rotate(18deg) translateY(100px) scale(0.7);
        }

        .gift-card.prev-3,
        .gift-card.next-3,
        .gift-card.hidden-card {
          opacity: 0;
          z-index: 1;
          filter: blur(5px) brightness(0.7);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .gift-card.prev-3 {
          transform: translate(-50%, -50%) translateX(-750px) rotate(-22deg) translateY(170px) scale(0.6);
        }

        .gift-card.next-3 {
          transform: translate(-50%, -50%) translateX(750px) rotate(22deg) translateY(170px) scale(0.6);
        }
        
        @media (max-width: 768px) {
          .gift-card.prev-1 {
            transform: translate(-50%, -50%) translateX(-200px) rotate(-11deg) translateY(30px) scale(0.85);
          }
          .gift-card.next-1 {
            transform: translate(-50%, -50%) translateX(200px) rotate(11deg) translateY(30px) scale(0.85);
          }
        }
      `}</style>
    </section>
  );
};
