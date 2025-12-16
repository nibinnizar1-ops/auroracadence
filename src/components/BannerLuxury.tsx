import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLuxuryBanner } from "@/lib/banners";
import bannerLuxury from "@/assets/banner-luxury.jpg";

export const BannerLuxury = () => {
  const [banner, setBanner] = useState<{ image_url: string; link_url: string | null } | null>(null);

  useEffect(() => {
    const loadBanner = async () => {
      const data = await getLuxuryBanner();
      if (data) {
        setBanner({
          image_url: data.image_url,
          link_url: data.link_url,
        });
      } else {
        // Fallback to default
        setBanner({
          image_url: bannerLuxury,
          link_url: "/collections",
        });
      }
    };
    loadBanner();
  }, []);

  if (!banner) return null;

  const image = (
    <img
      src={banner.image_url}
      alt="Aurora Cadence Luxury Collection"
      className="w-full h-[400px] md:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
    />
  );

  return (
    <section className="w-full">
      {banner.link_url ? (
        <Link to={banner.link_url} className="block w-full overflow-hidden group">
          {image}
        </Link>
      ) : (
        <div className="block w-full overflow-hidden group">
          {image}
        </div>
      )}
    </section>
  );
};
