import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { getHeroBanners } from "@/lib/banners";
import heroImage1 from "@/assets/hero-jewelry-1.jpg";
import heroImage2 from "@/assets/hero-jewelry-2.jpg";
import heroImage3 from "@/assets/hero-jewelry-3.jpg";

const defaultSlides = [
  { image: heroImage1, link_url: null },
  { image: heroImage2, link_url: null },
  { image: heroImage3, link_url: null },
];

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);

  useEffect(() => {
    const loadBanners = async () => {
      const banners = await getHeroBanners();
      // Merge database banners with defaults - use database image if exists for that position, otherwise use default
      const mergedSlides = defaultSlides.map((defaultSlide, index) => {
        const dbBanner = banners.find(banner => banner.position === index);
        return {
          image: dbBanner?.image_url || defaultSlide.image,
          link_url: dbBanner?.link_url || defaultSlide.link_url,
        };
      });
      setSlides(mergedSlides);
    };
    loadBanners();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (slides.length === 0) return null;

  const SlideContent = ({ slide, index }: { slide: typeof slides[0], index: number }) => {
    const content = (
      <img
        src={slide.image}
        alt={`Aurora Cadence Jewelry ${index + 1}`}
        className="w-full h-full object-cover"
      />
    );

    if (slide.link_url) {
      return (
        <Link to={slide.link_url} className="block w-full h-full">
          {content}
        </Link>
      );
    }

    return content;
  };

  return (
    <section className="relative h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <SlideContent slide={slide} index={index} />
        </div>
      ))}
      
      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-background hover:text-foreground bg-foreground/80 hover:bg-background/80"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-background hover:text-foreground bg-foreground/80 hover:bg-background/80"
            onClick={nextSlide}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? "bg-foreground w-8" : "bg-background/70"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
