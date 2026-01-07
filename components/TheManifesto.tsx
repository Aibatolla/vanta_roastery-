import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../lib/utils';

export const TheManifesto: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasEntered(true);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#0a0908]"
      aria-label="Brand Statement"
    >
      <style>{`
                @keyframes text-breathe {
                    0%, 100% { 
                        opacity: 0.85;
                        letter-spacing: -0.02em;
                    }
                    50% { 
                        opacity: 1;
                        letter-spacing: 0em;
                    }
                }
                @keyframes glow-breathe {
                    0%, 100% { 
                        text-shadow: 0 0 20px rgba(251,191,36,0.3);
                        opacity: 0.9;
                    }
                    50% { 
                        text-shadow: 0 0 40px rgba(251,191,36,0.5);
                        opacity: 1;
                    }
                }
                @keyframes fade-up {
                    0% { 
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    100% { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .text-live {
                    animation: text-breathe 4s ease-in-out infinite;
                }
                .text-glow-live {
                    animation: glow-breathe 3s ease-in-out infinite;
                }
                .fade-up {
                    animation: fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
            `}</style>

      {/* Split layout: Video left, Text right */}
      <div className="flex flex-col md:flex-row min-h-screen">

        {/* Left: Video */}
        <div className="relative w-full md:w-1/2 h-[40vh] md:h-screen">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/vanta.mp4" type="video/mp4" />
          </video>

          {/* Gradient overlay for text readability on mobile */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0908] md:bg-gradient-to-r md:from-transparent md:to-[#0a0908]" />
        </div>

        {/* Right: Text */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center px-8 py-16 md:py-0">
          <div className="max-w-lg">
            {/* Line 1 - italic intro */}
            <div className={cn("overflow-hidden mb-4", hasEntered ? "opacity-100" : "opacity-0")}>
              <span
                className={cn(
                  "inline-block font-serif text-xl md:text-2xl text-white/70 font-light italic opacity-0",
                  hasEntered && "fade-up text-live"
                )}
                style={{ animationDelay: '0ms' }}
              >
                Life is too short
              </span>
            </div>

            {/* Line 2 - main statement */}
            <div className={cn("overflow-hidden mb-2", hasEntered ? "opacity-100" : "opacity-0")}>
              <span
                className={cn(
                  "inline-block font-serif text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-none opacity-0",
                  hasEntered && "fade-up text-live"
                )}
                style={{ animationDelay: '200ms' }}
              >
                for ordinary
              </span>
            </div>

            {/* Line 3 - amber highlight */}
            <div className={cn("overflow-hidden", hasEntered ? "opacity-100" : "opacity-0")}>
              <span
                className={cn(
                  "inline-block font-serif text-4xl md:text-5xl lg:text-6xl text-amber-400 uppercase tracking-tight leading-none opacity-0",
                  hasEntered && "fade-up text-glow-live"
                )}
                style={{ animationDelay: '400ms' }}
              >
                coffee
              </span>
            </div>

            {/* Subtle line */}
            <div
              className={cn(
                "h-px bg-amber-500/30 mt-8 transition-all duration-1000",
                hasEntered ? "w-16 opacity-100" : "w-0 opacity-0"
              )}
              style={{ transitionDelay: '600ms' }}
            />
          </div>
        </div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-amber-400/20 rounded-full blur-[1px] animate-dust-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${50 + Math.random() * 50}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDuration: `${Math.random() * 8 + 12}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
};
