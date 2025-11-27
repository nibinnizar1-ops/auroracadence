import { Link } from "react-router-dom";
import bannerLuxury from "@/assets/banner-luxury.jpg";

export const BannerLuxury = () => {
  return (
    <section className="w-full">
      <Link to="/collections" className="block w-full overflow-hidden group">
        <img
          src={bannerLuxury}
          alt="Aurora Cadence Luxury Collection"
          className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
    </section>
  );
};
