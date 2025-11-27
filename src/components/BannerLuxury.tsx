import bannerLuxury from "@/assets/banner-luxury.jpg";

export const BannerLuxury = () => {
  return (
    <section className="w-full">
      <div className="w-full overflow-hidden">
        <img
          src={bannerLuxury}
          alt="Aurora Cadence Luxury Collection"
          className="w-full h-[400px] md:h-[500px] object-cover"
        />
      </div>
    </section>
  );
};
