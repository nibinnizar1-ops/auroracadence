import { Link } from "react-router-dom";
import bannerImage from "@/assets/banner-collection.jpg";

export const Banner = () => {
  return (
    <section className="w-full">
      <Link to="/collections" className="block w-full overflow-hidden group">
        <img
          src={bannerImage}
          alt="Aurora Cadence Collection"
          className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
    </section>
  );
};
