import { Card } from "./ui/card";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "Absolutely stunning quality! The craftsmanship is impeccable.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    name: "Emily R.",
    rating: 5,
    text: "Perfect for my wedding day. Received so many compliments!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    name: "Jessica L.",
    rating: 5,
    text: "Daily wear pieces that look luxurious. Love my collection!",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
  },
  {
    name: "Amanda K.",
    rating: 5,
    text: "Elegant and timeless. These pieces will last forever.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
  },
];

export const ReviewSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-foreground text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {reviews.map((review) => (
            <Card
              key={review.name}
              className="overflow-hidden border-border hover:border-foreground transition-all hover:shadow-lg"
              style={{ aspectRatio: "9/16" }}
            >
              <div className="relative h-full">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-foreground">
                  <div className="flex gap-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-sm mb-2">{review.text}</p>
                  <p className="text-xs text-gold font-medium">{review.name}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
