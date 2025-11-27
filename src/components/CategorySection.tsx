import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { 
    name: "Office Wear", 
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=800&fit=crop",
    subtitle: "Professional Elegance",
    description: "Sophisticated pieces that command attention in the boardroom",
    details: [
      { label: "Style", value: "Minimalist & Refined" },
      { label: "Pieces", value: "Studs, Pendants, Bracelets" },
      { label: "Metals", value: "Gold, Rose Gold, Silver" },
      { label: "Occasion", value: "Corporate & Meetings" }
    ],
    badges: ["Timeless", "Versatile", "Elegant"]
  },
  { 
    name: "Daily Wear", 
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=800&fit=crop",
    subtitle: "Effortless Charm",
    description: "Comfortable pieces perfect for everyday styling",
    details: [
      { label: "Style", value: "Casual & Comfortable" },
      { label: "Pieces", value: "Simple Chains, Rings" },
      { label: "Metals", value: "Sterling Silver, Gold-plated" },
      { label: "Occasion", value: "Everyday Wear" }
    ],
    badges: ["Comfortable", "Affordable", "Practical"]
  },
  { 
    name: "Party Wear", 
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=800&fit=crop",
    subtitle: "Statement Glamour",
    description: "Bold designs that turn heads at every celebration",
    details: [
      { label: "Style", value: "Bold & Dazzling" },
      { label: "Pieces", value: "Statement Necklaces, Earrings" },
      { label: "Metals", value: "Gold, Diamond, Gemstones" },
      { label: "Occasion", value: "Parties & Events" }
    ],
    badges: ["Glamorous", "Eye-catching", "Luxe"]
  },
  { 
    name: "Date Night", 
    image: "https://images.unsplash.com/photo-1588444650700-e6c90f69e4b7?w=1200&h=800&fit=crop",
    subtitle: "Romantic Elegance",
    description: "Delicate pieces that capture hearts and moments",
    details: [
      { label: "Style", value: "Romantic & Delicate" },
      { label: "Pieces", value: "Heart Pendants, Pearl Earrings" },
      { label: "Metals", value: "Rose Gold, White Gold" },
      { label: "Occasion", value: "Intimate Dinners" }
    ],
    badges: ["Romantic", "Feminine", "Charming"]
  },
  { 
    name: "Wedding Wear", 
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop",
    subtitle: "Bridal Opulence",
    description: "Exquisite heirloom pieces for your special day",
    details: [
      { label: "Style", value: "Grand & Traditional" },
      { label: "Pieces", value: "Necklace Sets, Maang Tikka" },
      { label: "Metals", value: "22K Gold, Diamonds, Kundan" },
      { label: "Occasion", value: "Weddings & Ceremonies" }
    ],
    badges: ["Heirloom", "Traditional", "Precious"]
  }
];

export const CategorySection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleSlideClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleNext = () => {
    if (activeIndex === null) {
      setActiveIndex(0);
    } else {
      setActiveIndex((activeIndex + 1) % categories.length);
    }
  };

  const handlePrev = () => {
    if (activeIndex === null) {
      setActiveIndex(categories.length - 1);
    } else {
      setActiveIndex((activeIndex - 1 + categories.length) % categories.length);
    }
  };

  return (
    <section id="luxury-moods" className="relative w-full h-screen overflow-hidden bg-muted">
      {/* Now Showing Badge */}
      <div className="absolute top-5 left-5 z-10 flex items-center gap-2 text-sm font-semibold text-accent">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Now in Collection
      </div>

      {/* Accordion Slider */}
      <div className="flex h-full">
        {categories.map((category, index) => (
          <div
            key={category.name}
            onClick={() => handleSlideClick(index)}
            className={`relative cursor-pointer bg-cover bg-center transition-all duration-700 ease-in-out overflow-hidden ${
              activeIndex === index 
                ? 'flex-[2.5] grayscale-0' 
                : 'flex-1 grayscale hover:grayscale-0'
            }`}
            style={{ backgroundImage: `url(${category.image})` }}
          >
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className={`absolute bottom-8 left-8 right-8 text-white z-10 transition-all duration-700 ${
              activeIndex === index ? 'bottom-20' : ''
            }`}>
              {/* Number */}
              <div className={`font-light text-white/60 leading-none transition-all duration-700 ${
                activeIndex === index 
                  ? 'text-5xl absolute -top-12 left-0' 
                  : 'text-6xl absolute bottom-8 left-8'
              }`}>
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Category Name */}
              <div className={`font-semibold text-white/80 mb-1 whitespace-nowrap transition-all duration-700 ${
                activeIndex === index 
                  ? 'text-base rotate-0 static' 
                  : 'text-base absolute bottom-24 left-8 origin-bottom-left -rotate-90'
              }`}>
                {category.name}
              </div>

              {/* Expanded Content */}
              {activeIndex === index && (
                <>
                  <h3 className="text-3xl font-bold mb-2 opacity-0 translate-y-8 animate-[fade-in_0.6s_ease-out_0.3s_forwards]">
                    {category.name}
                  </h3>
                  
                  <p className="text-base text-white/80 mb-5 opacity-0 translate-y-8 animate-[fade-in_0.6s_ease-out_0.4s_forwards]">
                    {category.subtitle}
                  </p>

                  <div className="opacity-0 translate-y-8 animate-[fade-in_0.6s_ease-out_0.5s_forwards]">
                    {category.details.map((detail, idx) => (
                      <div 
                        key={detail.label}
                        className="flex justify-between mb-1.5 text-sm opacity-0 -translate-x-5 animate-[fade-in_0.4s_ease-out_forwards]"
                        style={{ animationDelay: `${0.6 + idx * 0.05}s` }}
                      >
                        <span className="text-white/70">{detail.label}:</span>
                        <span className="font-semibold">{detail.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-4 opacity-0 translate-y-8 animate-[fade-in_0.6s_ease-out_0.8s_forwards]">
                    {category.badges.map((badge, idx) => (
                      <div 
                        key={badge}
                        className="flex items-center gap-1.5 px-2 py-1 bg-white/10 rounded-xl text-xs font-medium opacity-0 scale-90 animate-[scale-in_0.3s_ease-out_forwards]"
                        style={{ animationDelay: `${0.85 + idx * 0.05}s` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        {badge}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Add Button */}
            <button className="absolute bottom-8 right-8 w-8 h-8 rounded-full border-2 border-accent bg-transparent hover:bg-accent/20 transition-all duration-300 z-20 flex items-center justify-center">
              <div className="relative w-3 h-3">
                <div className={`absolute top-1/2 left-0 w-full h-0.5 bg-accent transition-transform duration-300 ${
                  activeIndex === index ? 'rotate-0' : ''
                }`} />
                <div className={`absolute left-1/2 top-0 w-0.5 h-full bg-accent transition-all duration-300 ${
                  activeIndex === index ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`} />
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border-none text-white text-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 z-20"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        onClick={handleNext}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border-none text-white text-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 z-20"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
};
