import realWife from "@/assets/real-wife.jpg";
import realGirlfriend from "@/assets/real-girlfriend.jpg";
import realMom from "@/assets/real-mom.jpg";
import realSister from "@/assets/real-sister.jpg";
import realDaughter from "@/assets/real-daughter.jpg";
import realFriend from "@/assets/real-friend.jpg";

const giftCategories = [
  { name: "WIFE", label: "Gifts for", illustration: realWife, color: "from-rose-500 to-pink-600", href: "#wife" },
  { name: "GIRLFRIEND", label: "Gifts for", illustration: realGirlfriend, color: "from-purple-500 to-pink-500", href: "#girlfriend" },
  { name: "MOM", label: "Gifts for", illustration: realMom, color: "from-amber-500 to-rose-500", href: "#mom" },
  { name: "SISTER", label: "Gifts for", illustration: realSister, color: "from-blue-500 to-purple-500", href: "#sister" },
  { name: "BEST FRIEND", label: "Gifts for", illustration: realFriend, color: "from-teal-500 to-blue-500", href: "#best-friend" },
];

export const GiftGuide = () => {

  return (
    <section className="py-20 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
            Timeless Gifts For Every Relationship
          </h2>
        </div>

        <div className="relative flex justify-center items-center min-h-[450px] px-4">
          <div className="flex items-stretch justify-center max-w-6xl">
            {giftCategories.map((category, index) => (
              <a
                key={category.name}
                href={category.href}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
                </div>

                {/* Content - Centered Vertically */}
                <div className="relative h-full flex flex-col items-center justify-center text-center p-6 z-10">
                  <div className="space-y-3">
                    <p className="text-white text-sm font-light tracking-[0.25em] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {category.label}
                    </p>
                    <h3 className="text-white text-3xl font-bold tracking-wide leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .gift-card {
          box-shadow: -1rem 0 3rem rgba(0, 0, 0, 0.3);
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gift-card:hover {
          transform: translateY(-20px);
          z-index: 100 !important;
        }

        .gift-card:hover ~ .gift-card {
          transform: translateX(80px);
        }
        
        .gift-card:has(~ .gift-card:hover) {
          transform: translateX(-80px);
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
          
          .gift-card:has(~ .gift-card:hover) {
            transform: translateX(-60px);
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
          
          .gift-card:has(~ .gift-card:hover) {
            transform: translateX(-40px);
          }
        }
      `}</style>
    </section>
  );
};
