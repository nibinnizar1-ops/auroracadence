import { Link } from "react-router-dom";
import { Card } from "./ui/card";

const categories = [
  { name: "Office Wear", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=600&fit=crop" },
  { name: "Daily Wear", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop" },
  { name: "Party Wear", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&h=600&fit=crop" },
  { name: "Date Night", image: "https://images.unsplash.com/photo-1588444650700-e6c90f69e4b7?w=800&h=600&fit=crop" },
  { name: "Wedding Wear", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop" },
];

export const CategorySection = () => {
  return (
    <section id="luxury-moods" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif text-gold text-center mb-12">
          Luxury For Every Mood
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link key={category.name} to={`#${category.name.toLowerCase().replace(' ', '-')}`}>
              <Card className="group overflow-hidden border-border hover:border-gold transition-all cursor-pointer">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-foreground group-hover:text-gold transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
