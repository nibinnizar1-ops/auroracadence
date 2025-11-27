import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const titleLetters = useRef<(HTMLSpanElement | null)[]>([]);
  const taglineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out preloader
        gsap.to(preloaderRef.current, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: onComplete
        });
      }
    });

    // Animate title letters
    tl.from(titleLetters.current, {
      duration: 1.2,
      opacity: 0,
      y: "100%",
      ease: "power4.out",
      stagger: 0.1
    });

    // Animate tagline
    tl.from(taglineRef.current, {
      duration: 1,
      opacity: 0,
      y: 30,
      ease: "power4.out"
    }, "-=0.5");

    // Hold for a moment
    tl.to({}, { duration: 0.8 });

  }, [onComplete]);

  return (
    <div
      ref={preloaderRef}
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Animated Title */}
        <div className="flex overflow-hidden">
          {['A', 'U', 'R', 'O', 'R', 'A'].map((letter, index) => (
            <div key={index} className="overflow-hidden">
              <span
                ref={(el) => (titleLetters.current[index] = el)}
                className="block text-[15vw] md:text-[12vw] lg:text-[10vw] font-bold px-[2px] tracking-[-0.05em]"
                style={{
                  background: 'var(--luxury-gradient)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {letter}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div className="overflow-hidden">
          <h3
            ref={taglineRef}
            className="text-xl md:text-2xl lg:text-3xl font-light tracking-[0.2em] text-center uppercase"
            style={{ color: 'hsl(var(--gold))' }}
          >
            Timeless Elegance
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
