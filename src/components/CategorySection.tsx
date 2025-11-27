import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const categories = [
  { name: "Office Wear", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=800&fit=crop" },
  { name: "Daily Wear", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&h=800&fit=crop" },
  { name: "Party Wear", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1200&h=800&fit=crop" },
  { name: "Date Night", image: "https://images.unsplash.com/photo-1588444650700-e6c90f69e4b7?w=1200&h=800&fit=crop" },
  { name: "Wedding Wear", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=800&fit=crop" },
];

export const CategorySection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(3);

  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  const maxSlide = Math.max(0, categories.length - slidesToShow);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev >= maxSlide ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev <= 0 ? maxSlide : prev - 1));
  };

  return (
    <section id="luxury-moods" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif text-foreground text-center mb-12 uppercase tracking-wide">
          Luxury For Every Mood
        </h2>
        
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-full h-12 w-12"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-full h-12 w-12"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Carousel Container */}
          <div className="overflow-hidden mx-12">
            <div 
              className="flex transition-transform duration-500 ease-out gap-4"
              style={{ 
                transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` 
              }}
            >
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="flex-shrink-0 relative group cursor-pointer"
                  style={{ width: `calc(${100 / slidesToShow}% - ${(slidesToShow - 1) * 16 / slidesToShow}px)` }}
                >
                  <div className="relative h-[500px] overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Category name */}
                    <div className="absolute bottom-8 left-0 right-0 text-center">
                      <h3 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-widest">
                        {category.name}
                      </h3>
                      <div className="w-16 h-0.5 bg-white mx-auto mt-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
