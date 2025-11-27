import { useState } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import cardWife from "@/assets/card-wife.jpg";
import cardGirlfriend from "@/assets/card-girlfriend.jpg";
import cardMom from "@/assets/card-mom.jpg";
import cardSister from "@/assets/card-sister.jpg";
import cardDaughter from "@/assets/card-daughter.jpg";
import cardFriend from "@/assets/card-friend.jpg";
import giftWife from "@/assets/gift-wife.jpg";
import giftGirlfriend from "@/assets/gift-girlfriend.jpg";
import giftMom from "@/assets/gift-mom.jpg";
import giftSister from "@/assets/gift-sister.jpg";
import giftDaughter from "@/assets/gift-daughter.jpg";
import giftFriend from "@/assets/gift-friend.jpg";

const giftCategories = [
  { name: "WIFE", label: "Gifts for", illustration: cardWife, jewelry: giftWife },
  { name: "GIRLFRIEND", label: "Gifts for", illustration: cardGirlfriend, jewelry: giftGirlfriend },
  { name: "MOM", label: "Gifts for", illustration: cardMom, jewelry: giftMom },
  { name: "SISTER", label: "Gifts for", illustration: cardSister, jewelry: giftSister },
  { name: "DAUGHTER", label: "Gifts for", illustration: cardDaughter, jewelry: giftDaughter },
  { name: "BEST FRIEND", label: "Gifts for", illustration: cardFriend, jewelry: giftFriend },
];

export const GiftGuide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCards = giftCategories.length;

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

          <div className="relative w-full max-w-[340px] h-[420px]">
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
                    
                    {/* Text overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/40 via-black/20 to-transparent">
                      <p className="text-white/90 text-sm font-light tracking-wider mb-1 text-center">
                        {category.label}
                      </p>
                      <h3 className="text-white text-3xl font-serif italic font-bold text-center tracking-wide drop-shadow-lg">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Decorative jewelry piece overlay - bottom right */}
                  <div className="absolute -bottom-8 -right-8 w-48 h-48 pointer-events-none">
                    <img 
                      src={category.jewelry} 
                      alt="Jewelry"
                      className="w-full h-full object-contain drop-shadow-2xl"
                      style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))' }}
                    />
                  </div>
                  
                  {/* Small jewelry accent - top left */}
                  <div className="absolute -top-4 -left-4 w-20 h-20 pointer-events-none opacity-90">
                    <img 
                      src={category.jewelry} 
                      alt="Jewelry accent"
                      className="w-full h-full object-contain drop-shadow-xl scale-75"
                    />
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
        }
        
        .gift-card.active {
          opacity: 1;
          z-index: 20;
          transform: translate(-50%, -50%) translateX(0) rotate(0deg) translateY(0);
          filter: blur(0);
          pointer-events: auto;
        }

        .gift-card.prev-1,
        .gift-card.next-1 {
          opacity: 0.6;
          z-index: 10;
          filter: blur(2px);
        }

        .gift-card.prev-1 {
          transform: translate(-50%, -50%) translateX(-280px) rotate(-12deg) translateY(40px);
        }

        .gift-card.next-1 {
          transform: translate(-50%, -50%) translateX(280px) rotate(12deg) translateY(40px);
        }

        .gift-card.prev-2,
        .gift-card.next-2 {
          opacity: 0.3;
          z-index: 5;
          filter: blur(4px);
        }

        .gift-card.prev-2 {
          transform: translate(-50%, -50%) translateX(-520px) rotate(-20deg) translateY(100px);
        }

        .gift-card.next-2 {
          transform: translate(-50%, -50%) translateX(520px) rotate(20deg) translateY(100px);
        }

        .gift-card.prev-3,
        .gift-card.next-3,
        .gift-card.hidden-card {
          opacity: 0;
          z-index: 1;
          filter: blur(6px);
        }

        .gift-card.prev-3 {
          transform: translate(-50%, -50%) translateX(-750px) rotate(-25deg) translateY(170px);
        }

        .gift-card.next-3 {
          transform: translate(-50%, -50%) translateX(750px) rotate(25deg) translateY(170px);
        }
      `}</style>
    </section>
  );
};
