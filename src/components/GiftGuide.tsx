import { Card } from "./ui/card";
import { Heart } from "lucide-react";

const giftCategories = [
  { name: "For Your Wife", icon: "💍" },
  { name: "For Your Girlfriend", icon: "💝" },
  { name: "For Your Mom", icon: "🌸" },
  { name: "For Your Sister", icon: "✨" },
];

export const GiftGuide = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
          <h2 className="text-4xl font-serif text-foreground mb-4">
            Timeless Gifts For Every Relationship
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect piece that speaks to your heart and celebrates your special bond
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {giftCategories.map((category) => (
            <Card
              key={category.name}
              className="group p-8 text-center border-border hover:border-foreground transition-all cursor-pointer hover:shadow-lg"
            >
              <div className="text-6xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">
                {category.name}
              </h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
