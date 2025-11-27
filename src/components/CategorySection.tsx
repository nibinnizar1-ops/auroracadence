import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { 
    name: "Office Wear", 
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=800&fit=crop",
    description: "Elegant Sophistication",
    details: [
      { label: "Style", value: "Professional & Refined" },
      { label: "Occasion", value: "Business Meetings" },
      { label: "Material", value: "Sterling Silver" },
      { label: "Finish", value: "Polished Shine" }
    ]
  },
  { 
    name: "Daily Wear", 
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=800&fit=crop",
    description: "Timeless Comfort",
    details: [
      { label: "Style", value: "Minimalist & Versatile" },
      { label: "Occasion", value: "Everyday Elegance" },
      { label: "Material", value: "Gold Plated" },
      { label: "Finish", value: "Brushed Matte" }
    ]
  },
  { 
    name: "Party Wear", 
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=800&fit=crop",
    description: "Statement Glamour",
    details: [
      { label: "Style", value: "Bold & Eye-catching" },
      { label: "Occasion", value: "Night Out" },
      { label: "Material", value: "18K Gold" },
      { label: "Finish", value: "High Polish" }
    ]
  },
  { 
    name: "Date Night", 
    image: "https://images.unsplash.com/photo-1588444650700-e6c90f69e4b7?w=1200&h=800&fit=crop",
    description: "Romantic Elegance",
    details: [
      { label: "Style", value: "Delicate & Charming" },
      { label: "Occasion", value: "Special Moments" },
      { label: "Material", value: "Rose Gold" },
      { label: "Finish", value: "Soft Glow" }
    ]
  },
  { 
    name: "Wedding Wear", 
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop",
    description: "Bridal Perfection",
    details: [
      { label: "Style", value: "Luxurious & Grand" },
      { label: "Occasion", value: "Celebrations" },
      { label: "Material", value: "24K Gold" },
      { label: "Finish", value: "Diamond Accent" }
    ]
  },
];

export const CategorySection = () => {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const handleSlideClick = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  const nextSlide = () => {
    const nextIndex = activeIndex === -1 ? 0 : (activeIndex + 1) % categories.length;
    setActiveIndex(nextIndex);
  };

  const prevSlide = () => {
    const prevIndex = activeIndex === -1 ? categories.length - 1 : (activeIndex - 1 + categories.length) % categories.length;
    setActiveIndex(prevIndex);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex]);

  return (
    <section id="luxury-moods" className="relative w-full h-screen bg-secondary/10 overflow-hidden">
      {/* Now Showing Indicator */}
      <div className="absolute top-5 left-5 z-10 flex items-center gap-2 text-accent font-semibold text-sm tracking-wide">
        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
        LUXURY FOR EVERY MOOD
      </div>

      {/* Accordion Slider */}
      <div className="flex h-full">
        {categories.map((category, index) => (
          <div
            key={category.name}
            onClick={() => handleSlideClick(index)}
            className={`relative flex-1 cursor-pointer bg-cover bg-center transition-all duration-700 ease-in-out overflow-hidden ${
              activeIndex === index 
                ? "flex-[2.5] grayscale-0" 
                : "grayscale hover:grayscale-0"
            }`}
            style={{ backgroundImage: `url(${category.image})` }}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className={`absolute text-white z-10 transition-all duration-700 ${
              activeIndex === index 
                ? "bottom-20 left-8 right-8" 
                : "bottom-8 left-8 right-8"
            }`}>
              {/* Slide Number */}
              <div className={`font-light text-white/60 transition-all duration-700 ${
                activeIndex === index
                  ? "text-5xl mb-2"
                  : "text-6xl absolute bottom-8 left-8"
              }`}>
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Category Name */}
              <div className={`font-serif font-semibold text-white/80 transition-all duration-700 ${
                activeIndex === index
                  ? "text-base mb-1 transform-none"
                  : "text-base absolute bottom-24 left-8 origin-left whitespace-nowrap -rotate-90"
              }`}>
                {category.name}
              </div>

              {/* Expanded Content */}
              <div className={`transition-all duration-600 ${
                activeIndex === index
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 pointer-events-none"
              }`}>
                <h3 className={`text-3xl font-bold mb-2 transition-all delay-300 ${
                  activeIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}>
                  {category.name}
                </h3>

                <p className={`text-base text-white/80 mb-5 transition-all delay-400 ${
                  activeIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}>
                  {category.description}
                </p>

                <div className={`space-y-1.5 mb-4 transition-all delay-500 ${
                  activeIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}>
                  {category.details.map((detail, idx) => (
                    <div 
                      key={detail.label}
                      className={`flex justify-between text-sm transition-all ${
                        activeIndex === index ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                      }`}
                      style={{ 
                        transitionDelay: activeIndex === index ? `${600 + idx * 50}ms` : '0ms' 
                      }}
                    >
                      <span className="text-white/70">{detail.label}:</span>
                      <span className="font-semibold">{detail.value}</span>
                    </div>
                  ))}
                </div>

                <div className={`flex gap-3 transition-all delay-800 ${
                  activeIndex === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}>
                  <div className={`flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm transition-all ${
                    activeIndex === index ? "opacity-100 scale-100 delay-850" : "opacity-0 scale-90"
                  }`}>
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span>Premium Quality</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm transition-all ${
                    activeIndex === index ? "opacity-100 scale-100 delay-900" : "opacity-0 scale-90"
                  }`}>
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span>Handcrafted</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm transition-all ${
                    activeIndex === index ? "opacity-100 scale-100 delay-950" : "opacity-0 scale-90"
                  }`}>
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span>Lifetime Warranty</span>
                  </div>
                </div>
              </div>

              {/* Add Button */}
              <button 
                className={`absolute bottom-8 right-8 w-8 h-8 border-2 border-accent rounded-full flex items-center justify-center transition-all duration-400 hover:bg-accent/20 ${
                  activeIndex === index ? "rotate-45" : "rotate-0"
                }`}
              >
                <div className="w-3 h-0.5 bg-accent absolute" />
                <div className={`w-0.5 h-3 bg-accent absolute transition-all duration-400 ${
                  activeIndex === index ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border-none rounded-full text-white text-2xl flex items-center justify-center transition-all hover:bg-white/20 z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border-none rounded-full text-white text-2xl flex items-center justify-center transition-all hover:bg-white/20 z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </section>
  );
};
