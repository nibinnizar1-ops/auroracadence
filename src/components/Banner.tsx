import bannerImage from "@/assets/banner-collection.jpg";

export const Banner = () => {
  return (
    <section className="w-full">
      <div className="w-full overflow-hidden">
        <img
          src={bannerImage}
          alt="Aurora Cadence Collection"
          className="w-full h-[400px] md:h-[500px] object-cover"
        />
      </div>
    </section>
  );
};
