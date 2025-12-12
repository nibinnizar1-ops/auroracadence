interface HeroBannerProps {
  imageUrl?: string;
  className?: string;
}

export const HeroBanner = ({
  imageUrl,
  className = "",
}: HeroBannerProps) => {
  return (
    <div className={`relative h-[70vh] min-h-[500px] overflow-hidden ${className}`}>
      {/* Background Image */}
      {imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-secondary/10 to-background" />
      )}
    </div>
  );
};

