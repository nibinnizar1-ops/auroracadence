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
  const [isAnimating, setIsAnimating] = useState(false);

  const updateCarousel = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((newIndex + categories.length) % categories.length);
    setTimeout(() => setIsAnimating(false), 1000);
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
            background: 'linear-gradient(to bottom, hsl(var(--foreground) / 0.15) 30%, transparent 76%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            fontFamily: 'Arial Black, Arial Bold, Arial, sans-serif'
          }}
        >
          LUXURY MOODS
        </h1>

        {/* 3D Carousel Container */}
        <div className="relative w-full max-w-6xl mx-auto h-[450px] mt-20" style={{ perspective: '1000px' }}>
          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-foreground/60 text-background hover:bg-foreground/80 hover:scale-110 transition-all"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-foreground/60 text-background hover:bg-foreground/80 hover:scale-110 transition-all"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Cards Track */}
          <div className="relative w-full h-full flex justify-center items-center" style={{ transformStyle: 'preserve-3d' }}>
            {categories.map((category, index) => {
              const cardClass = getCardClass(index);
              
              return (
                <div
                  key={category.name}
                  onClick={() => updateCarousel(index)}
                  onMouseEnter={() => updateCarousel(index)}
                  className={`absolute w-[280px] h-[380px] md:w-[320px] md:h-[420px] bg-card rounded-3xl overflow-hidden cursor-pointer ${
                    cardClass === 'hidden' ? 'opacity-0 pointer-events-none' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: cardClass === 'center' 
                      ? '0 25px 50px rgba(0, 0, 0, 0.25)' 
                      : '0 20px 40px rgba(0, 0, 0, 0.15)',
                    ...(cardClass === 'center' && {
                      zIndex: 10,
                      transform: 'scale(1.15) translateZ(0) rotateY(0deg)',
                    }),
                    ...(cardClass === 'left-1' && {
                      zIndex: 5,
                      transform: 'translateX(-220px) scale(0.92) translateZ(-80px) rotateY(15deg)',
                      opacity: 0.85,
                    }),
                    ...(cardClass === 'left-2' && {
                      zIndex: 1,
                      transform: 'translateX(-420px) scale(0.82) translateZ(-250px) rotateY(25deg)',
                      opacity: 0.6,
                    }),
                    ...(cardClass === 'right-1' && {
                      zIndex: 5,
                      transform: 'translateX(220px) scale(0.92) translateZ(-80px) rotateY(-15deg)',
                      opacity: 0.85,
                    }),
                    ...(cardClass === 'right-2' && {
                      zIndex: 1,
                      transform: 'translateX(420px) scale(0.82) translateZ(-250px) rotateY(-25deg)',
                      opacity: 0.6,
                    }),
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    style={{
                      transition: 'filter 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      filter: cardClass === 'center' ? 'none' : 'grayscale(100%) brightness(0.8)',
                    }}
                  />
                  
                  {/* Category Name Overlay on Card */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none">
                    <h3 className={`text-2xl font-serif text-white uppercase tracking-widest transition-all duration-1000 ${
                      cardClass === 'center' ? 'opacity-100 translate-y-0' : 'opacity-70 translate-y-2'
                    }`}>
                      {category.name}
                    </h3>
                    <p className={`text-sm text-white/90 uppercase tracking-wider mt-2 transition-all duration-1000 ${
                      cardClass === 'center' ? 'opacity-100' : 'opacity-50'
                    }`}>
                      {category.description}
                    </p>
                    <div className={`w-16 h-0.5 bg-white mt-3 transition-all duration-1000 ${
                      cardClass === 'center' ? 'opacity-100 scale-100' : 'opacity-50 scale-75'
                    }`} />
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
