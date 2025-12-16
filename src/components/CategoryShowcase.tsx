import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getActiveCategoryShowcaseItems } from "@/lib/category-showcase";

const defaultCategories = [
  { 
    name: "New Arrivals", 
    image_url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&q=80",
    href: "/new-arrivals"
  },
  { 
    name: "Bestseller", 
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&q=80",
    href: "/collections"
  },
  { 
    name: "Necklaces", 
    image_url: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&h=600&fit=crop&q=80",
    href: "/collections"
  },
  { 
    name: "Rings", 
    image_url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&q=80",
    href: "/collections"
  },
  { 
    name: "Earrings", 
    image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&q=80",
    href: "/collections"
  },
  { 
    name: "Bracelets", 
    image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&q=80",
    href: "/collections"
  },
];

export const CategoryShowcase = () => {
  const [categories, setCategories] = useState(defaultCategories);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getActiveCategoryShowcaseItems();
      // Merge database items with defaults - use database image if exists, otherwise use default
      const mergedCategories = defaultCategories.map(defaultCat => {
        const dbItem = data.find(item => item.name === defaultCat.name);
        return {
          name: defaultCat.name,
          image_url: dbItem?.image_url || defaultCat.image_url,
          href: dbItem?.href || defaultCat.href,
        };
      });
      setCategories(mergedCategories);
    };
    loadCategories();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center text-foreground mb-12 tracking-wide font-semibold">
          EVERYDAY LUXURY JEWELLERY
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
          {categories.map((category, index) => (
            <Link
              key={category.name || index}
              to={category.href}
              className="group relative overflow-hidden bg-secondary/10 border border-border hover:border-foreground transition-all"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 py-3 px-2">
                <h3 className="text-xs md:text-sm font-medium text-white text-center uppercase tracking-wider">
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
