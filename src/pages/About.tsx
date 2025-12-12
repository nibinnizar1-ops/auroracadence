import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-8">About Us</h1>
        
        <div className="max-w-4xl space-y-8">
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Where Everyday Elegance Meets Modern Luxury
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg mb-4">
              Aurora Cadence was created with a simple purpose: to bring refined, accessible luxury to women who appreciate beauty in the details. We design jewellery that complements every mood, moment, and expression — from daily wear to special occasions.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Our collections blend minimal design with high-quality craftsmanship, featuring 18k gold-plated essentials, Swarovski-studded pieces, and celebrity-inspired styles. Each piece is made to feel effortless, versatile, and distinctly personal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Philosophy</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              We believe jewellery should do more than accessorise. It should elevate confidence, express individuality, and move with you through every chapter of life.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Aurora Cadence stands for quiet luxury — subtle, timeless pieces that leave a lasting impression without overwhelming your style.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Craftsmanship & Quality</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Quality is at the core of everything we create.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4 mb-4">
              <li>Premium 18k gold plating for long-lasting shine</li>
              <li>Skin-safe, hypoallergenic materials</li>
              <li>Lightweight designs for all-day comfort</li>
              <li>Detailed finishing by skilled artisans</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed">
              Every product is tested and crafted with care to maintain elegance and durability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Designed for the Modern Woman</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Our pieces are made for women who appreciate elegance that feels effortless.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Whether it is workwear, a casual outing, a date night, or a wedding moment, our jewellery is curated to blend seamlessly with your lifestyle.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Aurora Cadence is for every woman who loves minimal aesthetics, graceful shine, and timeless style.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              We are committed to offering a seamless shopping experience, both online and across our partner stores. With thoughtful packaging, responsive support, and a customer-first approach, we strive to make every interaction with our brand warm and memorable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">The Journey Ahead</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">
              Aurora Cadence continues to evolve with new collections, improved craftsmanship, and deeper connections with our customers. As we grow, our aim remains unchanged: to offer jewellery that feels personal, intentional, and beautifully crafted.
            </p>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Thank you for being part of our story.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
