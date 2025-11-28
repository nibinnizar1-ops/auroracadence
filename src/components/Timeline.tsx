import { useEffect, useRef, useState } from "react";

const milestones = [
  {
    year: "2015",
    title: "The Beginning",
    description: "Aurora Cadence was born with a vision to bring timeless elegance to everyday wear.",
  },
  {
    year: "2016",
    title: "First Collection",
    description: "Launched our signature 18k Gold Layered collection, blending luxury with affordability.",
  },
  {
    year: "2017",
    title: "Swarovski Partnership",
    description: "Introduced authentic Swarovski crystals into our designs, adding sparkle to every piece.",
  },
  {
    year: "2018",
    title: "Store Expansion",
    description: "Opened our first flagship collaboration at Madannada, Kollam.",
  },
  {
    year: "2019",
    title: "Daily Wear Revolution",
    description: "Created lightweight, hypoallergenic pieces perfect for all-day comfort.",
  },
  {
    year: "2020",
    title: "Digital Presence",
    description: "Launched our online platform, making elegance accessible nationwide.",
  },
  {
    year: "2021",
    title: "Gift Guide Launch",
    description: "Curated relationship-based collections for meaningful gifting.",
  },
  {
    year: "2022",
    title: "Multi-Store Collaborations",
    description: "Partnered with Salon de R, Rock Paper, and Go Girl for wider reach.",
  },
  {
    year: "2023",
    title: "Influencer Community",
    description: "Built a community of real women sharing their Aurora Cadence stories.",
  },
  {
    year: "2024",
    title: "Occasion Collections",
    description: "Expanded into specialized collections for weddings, parties, and date nights.",
  },
];

export const Timeline = () => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const checkVisibility = () => {
      const newVisibleItems = new Set<number>();
      
      itemRefs.current.forEach((item, index) => {
        if (item) {
          const rect = item.getBoundingClientRect();
          const isVisible = rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth);
          
          if (isVisible) {
            newVisibleItems.add(index);
          }
        }
      });
      
      setVisibleItems(newVisibleItems);
    };

    checkVisibility();
    window.addEventListener("scroll", checkVisibility);
    window.addEventListener("resize", checkVisibility);

    return () => {
      window.removeEventListener("scroll", checkVisibility);
      window.removeEventListener("resize", checkVisibility);
    };
  }, []);

  return (
    <section className="py-20 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A decade of crafting elegance, one piece at a time.
          </p>
        </div>

        <div className="timeline-container relative pb-12">
          <ul className="relative">
            {milestones.map((milestone, index) => (
              <li
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`relative w-[6px] mx-auto pt-12 bg-border list-none transition-all duration-500 ease-in-out
                  ${index === milestones.length - 1 ? 'after:content-[""] after:absolute after:left-1/2 after:bottom-0 after:-translate-x-1/2 after:rotate-45 after:w-5 after:h-5 after:z-[2] after:bg-secondary' : ''}
                `}
              >
                <div
                  className={`absolute bottom-0 w-[90vw] max-w-[400px] p-6 bg-card rounded-lg flex flex-col md:flex-row items-center gap-4 transition-all duration-500 ease-in-out
                    ${index % 2 === 0 ? 'left-[45px]' : 'md:left-[-439px] left-[45px]'}
                    ${visibleItems.has(index) 
                      ? 'opacity-100 visible translate-x-0 translate-y-0 rotate-0 shadow-elegant' 
                      : `opacity-0 invisible ${index % 2 === 0 ? 'translate-x-[100px]' : 'md:-translate-x-[100px] translate-x-[100px]'} -translate-y-[10px] rotate-[10deg]`
                    }
                  `}
                >
                  <time className="absolute -top-[15px] left-6 bg-gradient-to-r from-gold to-gold-dark text-foreground w-20 h-[30px] rounded-md flex justify-center items-center tracking-wider text-sm font-semibold shadow-gold">
                    {milestone.year}
                  </time>
                  
                  <div className="flex flex-col justify-center items-center text-center pt-4 md:pt-0 flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
