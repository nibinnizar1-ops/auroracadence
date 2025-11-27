import { useState } from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";

const categories = ["All", "Necklaces", "Rings", "Earrings", "Bracelets"];

const products = [
  {
    id: 1,
    name: "Diamond Eternity Necklace",
    category: "Necklaces",
    price: 2499.00,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&h=600&fit=crop&q=80",
    badge: "NEW"
  },
  {
    id: 2,
    name: "Pearl Pendant Necklace",
    category: "Necklaces",
    price: 1899.00,
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&h=600&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Solitaire Diamond Ring",
    category: "Rings",
    price: 3299.00,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&q=80",
    badge: "BESTSELLER"
  },
  {
    id: 4,
    name: "Gold Band Ring",
    category: "Rings",
    price: 1599.00,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Crystal Hoop Earrings",
    category: "Earrings",
    price: 899.00,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&q=80",
    badge: "NEW"
  },
  {
    id: 6,
    name: "Pearl Stud Earrings",
    category: "Earrings",
    price: 1299.00,
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&h=600&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Hearts All Over Bracelet",
    category: "Bracelets",
    price: 2229.00,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&q=80",
    badge: "BUY 1 GET 1"
  },
  {
    id: 8,
    name: "Diamond Affair Bracelet",
    category: "Bracelets",
    price: 2553.00,
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&h=600&fit=crop&q=80",
    badge: "BUY 1 GET 1"
  },
];

export const FilteredProductGrid = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProducts = activeFilter === "All" 
    ? products 
    : products.filter(product => product.category === activeFilter);

  return (
    <div className="space-y-8">
      {/* Filter Buttons */}
      <div className="flex justify-center gap-3 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-8 py-3 text-sm font-medium uppercase tracking-wider transition-all ${
              activeFilter === category
                ? "bg-foreground text-background"
                : "bg-background text-foreground border-2 border-foreground hover:bg-foreground/5"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative bg-background border border-border hover:border-foreground transition-all cursor-pointer"
          >
            {/* Badge */}
            {product.badge && (
              <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm px-3 py-1 z-10">
                <span className="text-xs font-medium uppercase tracking-wider">
                  {product.badge}
                </span>
              </div>
            )}

            {/* Wishlist Button */}
            <button className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm p-2 rounded-full hover:bg-foreground hover:text-background transition-all z-10">
              <Heart className="h-4 w-4" />
            </button>

            {/* Product Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
                {product.name}
              </h3>
              <p className="text-lg font-semibold text-foreground">
                ₹ {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-2 border-foreground hover:bg-foreground hover:text-background"
              >
                ADD TO BAG
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
