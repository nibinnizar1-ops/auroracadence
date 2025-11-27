import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import heroImage1 from "@/assets/hero-jewelry-1.jpg";
import heroImage2 from "@/assets/hero-jewelry-2.jpg";
import heroImage3 from "@/assets/hero-jewelry-3.jpg";

const slides = [
  {
    image: heroImage1,
    title: "Timeless Elegance",
    subtitle: "Discover our new collection",
  },
  {
    image: heroImage2,
    title: "Luxury Redefined",
    subtitle: "Crafted with precision",
  },
  {
    image: heroImage3,
    title: "Eternal Beauty",
    subtitle: "For every precious moment",
  },
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 px-4">
              <h1 className="text-5xl md:text-7xl font-serif text-gold animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-foreground animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-gold text-background hover:bg-gold-dark mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500"
              >
                Explore Collection
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground hover:text-gold hover:bg-background/20"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground hover:text-gold hover:bg-background/20"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-gold w-8" : "bg-foreground/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};
