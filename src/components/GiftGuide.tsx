import { Heart } from "lucide-react";
import realWife from "@/assets/real-wife.jpg";
import realGirlfriend from "@/assets/real-girlfriend.jpg";
import realMom from "@/assets/real-mom.jpg";
import realSister from "@/assets/real-sister.jpg";
import realDaughter from "@/assets/real-daughter.jpg";
import realFriend from "@/assets/real-friend.jpg";

const giftCategories = [
  { name: "WIFE", label: "Gifts for", illustration: realWife, color: "from-rose-500 to-pink-600" },
  { name: "GIRLFRIEND", label: "Gifts for", illustration: realGirlfriend, color: "from-purple-500 to-pink-500" },
  { name: "MOM", label: "Gifts for", illustration: realMom, color: "from-amber-500 to-rose-500" },
  { name: "SISTER", label: "Gifts for", illustration: realSister, color: "from-blue-500 to-purple-500" },
  { name: "DAUGHTER", label: "Gifts for", illustration: realDaughter, color: "from-pink-500 to-rose-500" },
  { name: "BEST FRIEND", label: "Gifts for", illustration: realFriend, color: "from-teal-500 to-blue-500" },
];

export const GiftGuide = () => {

  return (
    <section className="py-20 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Heart className="w-12 h-12 text-accent mx-auto mb-4 animate-pulse" />
          <h2 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
            Timeless Gifts For Every Relationship
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Find the perfect piece that speaks to your heart and celebrates your special bond
          </p>
        </div>

        <div className="relative flex justify-center items-center min-h-[450px] px-4">
          <div className="flex items-stretch justify-center max-w-6xl">
            {giftCategories.map((category, index) => (
              <div
                key={category.name}
                className="gift-card group relative h-[400px] w-[280px] bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-500 ease-out cursor-pointer border border-border/50"
                style={{
                  marginLeft: index === 0 ? '0' : '-80px',
                  zIndex: giftCategories.length - index,
                }}
              >
                {/* Image Background */}
                <div className="absolute inset-0 overflow-hidden">
                  <img 
                    src={category.illustration} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Progress Bar */}
                <div className="absolute top-6 left-6 right-6 z-10">
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${category.color} transition-all duration-500 w-0 group-hover:w-3/4 rounded-full`} />
                  </div>
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-between p-6 z-10">
                  <div>
                    <p className="text-white/80 text-xs font-light tracking-[0.3em] uppercase mb-1">
                      {category.label}
                    </p>
                    <h3 className="text-white text-2xl font-bold tracking-wide">
                      {category.name}
                    </h3>
                  </div>

                  {/* Animated Circle */}
                  <div className="flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <svg width="100" height="100" className="transform -rotate-90">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        className="transition-all duration-700 opacity-30"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                        className="transition-all duration-700 circle-progress"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .gift-card {
          box-shadow: -1rem 0 3rem rgba(0, 0, 0, 0.3);
        }

        .gift-card:hover {
          transform: translateY(-20px);
          z-index: 100 !important;
        }

        .gift-card:hover ~ .gift-card {
          transform: translateX(80px);
        }

        .gift-card:hover .circle-progress {
          stroke-dashoffset: 100;
        }

        @media (max-width: 1024px) {
          .gift-card {
            margin-left: -60px !important;
            width: 240px !important;
            height: 360px !important;
          }

          .gift-card:first-child {
            margin-left: 0 !important;
          }

          .gift-card:hover ~ .gift-card {
            transform: translateX(60px);
          }
        }

        @media (max-width: 768px) {
          .gift-card {
            margin-left: -40px !important;
            width: 200px !important;
            height: 320px !important;
          }

          .gift-card:hover ~ .gift-card {
            transform: translateX(40px);
          }
        }
      `}</style>
    </section>
  );
};
