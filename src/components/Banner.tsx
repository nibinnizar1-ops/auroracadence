import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCollectionBanner } from "@/lib/banners";
import bannerImage from "@/assets/banner-collection.jpg";

export const Banner = () => {
  const [banner, setBanner] = useState<{ image_url: string; link_url: string | null } | null>(null);

  useEffect(() => {
    const loadBanner = async () => {
      const data = await getCollectionBanner();
      if (data) {
        setBanner({
          image_url: data.image_url,
          link_url: data.link_url,
        });
      } else {
        // Fallback to default
        setBanner({
          image_url: bannerImage,
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
      alt="Aurora Cadence Collection"
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
