import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const categories = [
  { name: "Office Wear", description: "Professional & Elegant", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=800&fit=crop" },
  { name: "Daily Wear", description: "Comfortable & Chic", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=800&fit=crop" },
  { name: "Party Wear", description: "Bold & Glamorous", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=800&fit=crop" },
  { name: "Date Night", description: "Romantic & Sophisticated", image: "https://images.unsplash.com/photo-1588444650700-e6c90f69e4b7?w=1200&h=800&fit=crop" },
  { name: "Wedding Wear", description: "Timeless & Luxurious", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop" },
];

export const CategorySection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const updateCarousel = (newIndex: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((newIndex + categories.length) % categories.length);
    setTimeout(() => setIsAnimating(false), 800);
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
                  className={`absolute w-[280px] h-[380px] md:w-[320px] md:h-[420px] bg-card rounded-3xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
                    cardClass === 'hidden' ? 'opacity-0 pointer-events-none' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    ...(cardClass === 'center' && {
                      zIndex: 10,
                      transform: 'scale(1.1) translateZ(0)',
                    }),
                    ...(cardClass === 'left-1' && {
                      zIndex: 5,
                      transform: 'translateX(-200px) scale(0.9) translateZ(-100px)',
                      opacity: 0.9,
                    }),
                    ...(cardClass === 'left-2' && {
                      zIndex: 1,
                      transform: 'translateX(-400px) scale(0.8) translateZ(-300px)',
                      opacity: 0.7,
                    }),
                    ...(cardClass === 'right-1' && {
                      zIndex: 5,
                      transform: 'translateX(200px) scale(0.9) translateZ(-100px)',
                      opacity: 0.9,
                    }),
                    ...(cardClass === 'right-2' && {
                      zIndex: 1,
                      transform: 'translateX(400px) scale(0.8) translateZ(-300px)',
                      opacity: 0.7,
                    }),
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className={`w-full h-full object-cover transition-all duration-[800ms] ${
                      cardClass === 'center' ? '' : 'grayscale'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Info */}
        <div className="text-center mt-10 transition-opacity duration-500">
          <h2 className="text-4xl font-bold text-foreground mb-3 relative inline-block">
            <span className="relative z-10">{categories[currentIndex].name}</span>
            <div className="absolute top-1/2 left-[-120px] w-[100px] h-0.5 bg-foreground" />
            <div className="absolute top-1/2 right-[-120px] w-[100px] h-0.5 bg-foreground" />
          </h2>
          <p className="text-xl text-muted-foreground uppercase tracking-widest mt-2">
            {categories[currentIndex].description}
          </p>
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
