import { Link } from "react-router-dom";

const categories = [
  { 
    name: "New Arrivals", 
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&q=80",
    href: "#new-arrivals"
  },
  { 
    name: "Bestseller", 
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&q=80",
    href: "#bestseller"
  },
  { 
    name: "Necklaces", 
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&h=600&fit=crop&q=80",
    href: "#necklaces"
  },
  { 
    name: "Rings", 
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&q=80",
    href: "#rings"
  },
  { 
    name: "Earrings", 
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&q=80",
    href: "#earrings"
  },
  { 
    name: "Bracelets", 
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&q=80",
    href: "#bracelets"
  },
];

export const CategoryShowcase = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-foreground mb-12 tracking-wide">
          EVERYDAY LUXURY JEWELLERY
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="group relative overflow-hidden bg-secondary/10 border border-border hover:border-foreground transition-all"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm py-3 px-2 border-t border-border">
                <h3 className="text-xs md:text-sm font-medium text-foreground text-center uppercase tracking-wider">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
