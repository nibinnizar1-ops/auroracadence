import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import heroJewelry1 from "@/assets/hero-jewelry-1.jpg";
import heroJewelry2 from "@/assets/hero-jewelry-2.jpg";
import heroJewelry3 from "@/assets/hero-jewelry-3.jpg";

const categories = [
  { name: "Office Wear", description: "Professional & Elegant", image: heroJewelry1 },
  { name: "Daily Wear", description: "Comfortable & Chic", image: heroJewelry2 },
  { name: "Party Wear", description: "Bold & Glamorous", image: heroJewelry3 },
  { name: "Date Night", description: "Romantic & Sophisticated", image: heroJewelry1 },
  { name: "Wedding Wear", description: "Timeless & Luxurious", image: heroJewelry2 },
];

export const CategorySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const updateCarousel = (newIndex: number) => {
    setCurrentIndex((newIndex + categories.length) % categories.length);
  };

  const nextSlide = () => updateCarousel(currentIndex + 1);
  const prevSlide = () => updateCarousel(currentIndex - 1);

  const getCardClass = (index: number) => {
    const offset = (index - currentIndex + categories.length) % categories.length;
    
    if (offset === 0) return "center";
    if (offset === 1) return "right-1";
    if (offset === 2) return "right-2";
    if (offset === categories.length - 1) return "left-1";
    if (offset === categories.length - 2) return "left-2";
    return "hidden";
  };

  return (
    <section id="luxury-moods" className="relative py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Large Background Title */}
        <h1 
          className="absolute top-12 left-1/2 -translate-x-1/2 text-[6rem] md:text-[7.5rem] font-black uppercase tracking-tighter pointer-events-none whitespace-nowrap"
          style={{
            background: 'linear-gradient(to bottom, hsl(var(--foreground) / 0.3) 30%, transparent 76%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            fontFamily: 'Arial Black, Arial Bold, Arial, sans-serif'
          }}
        >
          LUXURY MOODS
        </h1>

        {/* Carousel Container */}
        <div className="relative w-full max-w-7xl mx-auto h-[500px] mt-20 px-4">
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 text-foreground hover:bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/90 text-foreground hover:bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Cards Track */}
          <div className="relative w-full h-full flex justify-center items-center overflow-visible">
            {categories.map((category, index) => {
              const cardClass = getCardClass(index);
              
              return (
                <div
                  key={category.name}
                  onClick={() => updateCarousel(index)}
                  onMouseEnter={() => updateCarousel(index)}
                  className={`absolute h-[450px] bg-card rounded-2xl overflow-hidden cursor-pointer ${
                    cardClass === 'hidden' ? 'opacity-0 pointer-events-none' : ''
                  }`}
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: cardClass === 'center'
                      ? '0 20px 40px rgba(0, 0, 0, 0.3)' 
                      : '0 10px 20px rgba(0, 0, 0, 0.15)',
                    ...(cardClass === 'center' && {
                      zIndex: 10,
                      width: '380px',
                      transform: 'scale(1)',
                    }),
                    ...(cardClass === 'left-1' && {
                      zIndex: 5,
                      width: '320px',
                      transform: 'translateX(-340px) scale(0.9)',
                      opacity: 0.9,
                    }),
                    ...(cardClass === 'left-2' && {
                      zIndex: 3,
                      width: '280px',
                      transform: 'translateX(-620px) scale(0.8)',
                      opacity: 0.7,
                    }),
                    ...(cardClass === 'right-1' && {
                      zIndex: 5,
                      width: '320px',
                      transform: 'translateX(340px) scale(0.9)',
                      opacity: 0.9,
                    }),
                    ...(cardClass === 'right-2' && {
                      zIndex: 3,
                      width: '280px',
                      transform: 'translateX(620px) scale(0.8)',
                      opacity: 0.7,
                    }),
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    style={{
                      transition: 'filter 0.3s ease',
                      filter: cardClass === 'center'
                        ? 'none' 
                        : 'brightness(0.7)',
                    }}
                  />
                  
                  {/* Category Name Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    <div className={`text-center transition-all duration-300 ${
                      cardClass === 'center'
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-70 translate-y-2'
                    }`}>
                      <h3 className="text-2xl font-medium text-white uppercase tracking-[0.3em] mb-1">
                        {category.name}
                      </h3>
                      {cardClass === 'center' && (
                        <div className="w-20 h-[2px] bg-white mx-auto mt-3" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-3 mt-16">
          {categories.map((_, index) => (
            <button
              key={index}
              onClick={() => updateCarousel(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-foreground scale-125' 
                  : 'bg-foreground/20 hover:bg-foreground/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
