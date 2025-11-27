import { Button } from "./ui/button";
import bannerImage from "@/assets/banner-collection.jpg";

export const Banner = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-lg group cursor-pointer">
          <img
            src={bannerImage}
            alt="Aurora Cadence Collection"
            className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="px-12 space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif text-gold">
                Exclusive Collection
              </h2>
              <p className="text-xl text-foreground max-w-md">
                Discover our handcrafted masterpieces designed for the modern woman
              </p>
              <Button className="bg-gold text-background hover:bg-gold-dark">
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
