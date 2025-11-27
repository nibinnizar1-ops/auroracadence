import { useState } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import giftWife from "@/assets/gift-wife.jpg";
import giftGirlfriend from "@/assets/gift-girlfriend.jpg";
import giftMom from "@/assets/gift-mom.jpg";
import giftSister from "@/assets/gift-sister.jpg";
import giftDaughter from "@/assets/gift-daughter.jpg";
import giftFriend from "@/assets/gift-friend.jpg";

const giftCategories = [
  { name: "For Your Wife", icon: "💍", description: "Elegant pieces that celebrate your eternal bond", image: giftWife },
  { name: "For Your Girlfriend", icon: "💝", description: "Romantic jewelry to express your love", image: giftGirlfriend },
  { name: "For Your Mom", icon: "🌸", description: "Timeless gifts to honor her grace", image: giftMom },
  { name: "For Your Sister", icon: "✨", description: "Beautiful pieces for your best friend", image: giftSister },
  { name: "For Your Daughter", icon: "🎀", description: "Precious treasures for your little one", image: giftDaughter },
  { name: "For Your Best Friend", icon: "💎", description: "Sparkling gifts for lifelong friendship", image: giftFriend },
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

        <div className="relative flex items-center justify-center min-h-[400px]">
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-background/80 hover:bg-background border border-border hover:border-foreground transition-all shadow-lg"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-[280px] h-[320px]">
            {giftCategories.map((category, index) => (
              <div
                key={category.name}
                className={`gift-card ${getCardClass(index)} absolute left-1/2 top-1/2 w-[280px] h-[320px] -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-2xl overflow-hidden shadow-elegant transition-all duration-500 ease-out`}
              >
                <div className="relative h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center p-6 -mt-8 relative z-10">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
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
          transform: translate(-50%, -50%) translateX(-240px) rotate(-12deg) translateY(30px);
        }

        .gift-card.next-1 {
          transform: translate(-50%, -50%) translateX(240px) rotate(12deg) translateY(30px);
        }

        .gift-card.prev-2,
        .gift-card.next-2 {
          opacity: 0.3;
          z-index: 5;
          filter: blur(4px);
        }

        .gift-card.prev-2 {
          transform: translate(-50%, -50%) translateX(-450px) rotate(-20deg) translateY(80px);
        }

        .gift-card.next-2 {
          transform: translate(-50%, -50%) translateX(450px) rotate(20deg) translateY(80px);
        }

        .gift-card.prev-3,
        .gift-card.next-3,
        .gift-card.hidden-card {
          opacity: 0;
          z-index: 1;
          filter: blur(6px);
        }

        .gift-card.prev-3 {
          transform: translate(-50%, -50%) translateX(-650px) rotate(-25deg) translateY(150px);
        }

        .gift-card.next-3 {
          transform: translate(-50%, -50%) translateX(650px) rotate(25deg) translateY(150px);
        }
      `}</style>
    </section>
  );
};
