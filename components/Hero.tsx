import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { Magnetic } from './Magnetic';
import { useMenu } from '../context/MenuContext';

interface HeroProps {
  posterSrc?: string;
  brandName?: string;
  onReserveClick?: () => void;
}

// Reusing the Topographic Pattern for consistency
const TopographicBackground = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay z-10"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='topo' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 100 C 20 0 50 0 100 100 Z M0 0 C 50 100 80 100 100 0 Z' fill='none' stroke='%23d97706' stroke-width='0.5' /%3E%3C/pattern%3E%3C/defs%3E%3Crect x='0' y='0' width='100%25' height='100%25' fill='url(%23topo)' /%3E%3C/svg%3E")`,
      backgroundSize: '300px 300px'
    }}
  />
);

// Film Grain Overlay for cinematic feel
const CinematicGrain = () => (
  <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.07] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

export const Hero: React.FC<HeroProps> = ({
  posterSrc,
  brandName = "VANTA",
  onReserveClick
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { open: menuOpen } = useMenu();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate generic scroll progress (0 to 1 over 500px)
  const scrollProgress = Math.min(scrollY / 500, 1);

  useEffect(() => {
    const preloaderTimer = setTimeout(() => setIsLoading(false), 1200);
    const contentTimer = setTimeout(() => setIsReady(true), 1600);

    return () => {
      clearTimeout(preloaderTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  return (
    <section
      className="relative w-full h-dvh overflow-hidden flex flex-col justify-center items-center bg-[#020202]"
      aria-label="Hero Section"
    >
      <style>{`
        @keyframes reveal {
          0% { opacity: 0; transform: scale(1.1) translateY(20px); filter: blur(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.8; text-shadow: 0 0 15px rgba(251,191,36,0.4); }
          50% { opacity: 1; text-shadow: 0 0 35px rgba(251,191,36,1), 0 0 15px rgba(251,191,36,0.8); }
        }
        @keyframes deep-breathe {
          0%, 100% { opacity: 0.8; text-shadow: 0 0 15px rgba(251,191,36,0.4); transform: scale(1); }
          50% { opacity: 1; text-shadow: 0 0 40px rgba(251,191,36,0.9), 0 0 20px rgba(251,191,36,0.6); transform: scale(1.08); }
        }
        .animate-glow {
          animation: glow 2.5s ease-in-out infinite;
        }
        .animate-deep-breathe {
          animation: deep-breathe 4s ease-in-out infinite;
        }
        .luxury-gold-text {
          background: linear-gradient(
            to bottom,
            #fbbf24 0%,
            #d97706 40%,
            #92400e 70%,
            #78350f 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          position: relative;
        }
        /* Create a shining sheen layer over the text */
        .luxury-gold-text::after {
          content: attr(data-text);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            120deg,
            transparent 0%,
            transparent 35%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 65%,
            transparent 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shimmer 6s ease-in-out infinite;
          animation-delay: 2s; /* Wait for reveal */
          opacity: 0.8;
          pointer-events: none;
        }
        .animate-reveal {
          animation: reveal 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* --- PRELOADER --- */}
      <div
        className={cn(
          "fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#080706] transition-transform duration-[1000ms] cubic-bezier(0.85, 0, 0.15, 1)",
          !isLoading ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className={cn(
          "relative flex flex-col items-center gap-6 transition-opacity duration-300",
          !isLoading ? "opacity-0" : "opacity-100"
        )}>
          <div className="w-16 h-16 border-t-2 border-r-2 border-amber-500 rounded-full animate-spin duration-700" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-sans animate-pulse">
            Extraction in Progress
          </span>
        </div>
      </div>

      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 z-0 bg-[#020202]" />

      {posterSrc && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={posterSrc}
            alt="Coffee aesthetic"
            loading="eager"
            decoding="async"
            className={cn(
              "w-full h-full object-cover origin-center will-change-transform",
              isReady ? "animate-hero-drift opacity-100" : "scale-110 opacity-0 transition-opacity duration-[1500ms]"
            )}
          />

          {/* Lighter Gradient Overlay: More visibility of the poster */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 pointer-events-none" />

          {/* Mobile-Specific Dark Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent md:hidden pointer-events-none opacity-90" />

          {/* Texture Layers */}
          <TopographicBackground />
          <CinematicGrain />

          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
        </div>
      )}

      {/* --- NAV - Hidden, handled by Navigation component --- */}

      {/* --- HERO CONTENT --- */}
      <div className="relative z-20 w-full max-w-[95vw] md:max-w-7xl px-4 flex flex-col items-center justify-center text-center">

        {/* Badge: EST. LOS ANGELES 2024 */}
        <div className="overflow-visible mb-8 md:mb-10">
          <div className={cn(
            "flex items-center justify-center opacity-0 transition-transform duration-[1200ms] ease-out delay-100",
            isReady && "opacity-100 translate-y-0 animate-slide-up"
          )}>
            <div className="px-5 py-2 rounded-full bg-black/40 backdrop-blur-md border border-amber-500/30 animate-badge-pulse-shadow shadow-[0_0_20px_rgba(251,191,36,0.15)] group hover:border-amber-500/50 transition-colors">
              <span className="text-[9px] md:text-[10px] font-sans uppercase tracking-[0.3em] text-amber-100 font-bold drop-shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-glow inline-block">
                Est. Los Angeles 2024
              </span>
            </div>
          </div>
        </div>

        {/* MAIN TITLE: VANTA COFFEE */}
        <h1
          className={cn(
            "flex flex-col items-center justify-center font-serif text-center relative will-change-transform",
            "text-[clamp(3rem,12vw,8rem)] leading-[0.85] tracking-tight drop-shadow-2xl"
          )}
          style={{
            transform: `scale(${1 + scrollProgress * 0.12})`,
            filter: `blur(${scrollProgress * 4}px)`,
            opacity: 1 - scrollProgress * 1.5,
            letterSpacing: `${-0.02 + scrollProgress * 0.1}em`
          }}
        >
          {/* CINEMATIC REVEAL ANIMATION */}
          <span
            className={cn(
              "luxury-gold-text opacity-0",
              isReady && "animate-reveal"
            )}
            style={{ animationDelay: '0.2s' }}
            data-text={brandName}
          >
            {brandName}
          </span>
          <span
            className={cn(
              "luxury-gold-text opacity-0",
              isReady && "animate-reveal"
            )}
            style={{ animationDelay: '0.5s' }}
            data-text="COFFEE"
          >
            COFFEE
          </span>
        </h1>

        {/* Tagline */}
        <div className={cn(
          "mt-10 md:mt-12 opacity-0 px-4",
          isReady && "animate-slide-up [animation-duration:1.4s] [animation-delay:400ms]"
        )}>
          <p className="font-sans font-semibold text-xs md:text-sm uppercase tracking-[0.25em] md:tracking-[0.3em] text-white/95 leading-relaxed text-balance drop-shadow-xl">
            Sourced from the <span className="font-bold inline-block text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-deep-breathe">top 1%</span> of global micro-lots.
          </p>
        </div>

        {/* Actions - GLASS BUTTONS */}
        <div className={cn(
          "flex flex-col sm:flex-row gap-6 mt-16 w-full sm:w-auto items-center opacity-0",
          isReady && "animate-slide-up [animation-duration:1.4s] [animation-delay:600ms]"
        )}>

          <Magnetic strength={0.4}>
            <button
              onClick={menuOpen}
              className="group relative w-full sm:w-auto px-10 py-4 rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 
              bg-[#2a1b12]/60 backdrop-blur-lg border border-amber-500/30 
              shadow-[0_0_30px_-5px_rgba(251,191,36,0.15)] hover:shadow-[0_0_40px_-5px_rgba(251,191,36,0.4)] hover:border-amber-500/60">

              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-200/50 to-transparent opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <span className="relative z-10 font-sans text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-amber-50 group-hover:text-amber-100 transition-colors drop-shadow-md">
                The Menu
              </span>
            </button>
          </Magnetic>

          <Magnetic strength={0.4}>
            <button
              onClick={onReserveClick}
              className="group relative w-full sm:w-auto px-10 py-4 rounded-full overflow-hidden transition-all duration-500 
              bg-[#2a1b12]/30 backdrop-blur-lg border border-white/10 
              hover:bg-[#3a2b22]/50 hover:border-amber-500/30 hover:shadow-[0_0_30px_-5px_rgba(251,191,36,0.1)]">

              <span className="relative z-10 font-sans text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase text-neutral-300 group-hover:text-amber-100 transition-colors duration-300 drop-shadow-sm">
                Reserve
              </span>
            </button>
          </Magnetic>
        </div>
      </div>

      {/* --- SCROLL HINT --- */}
      <div className={cn(
        "absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-opacity duration-1000 delay-1000",
        isReady ? "opacity-100" : "opacity-0"
      )}>
        <div className="w-[1px] h-10 md:h-12 bg-gradient-to-b from-transparent via-amber-500/50 to-transparent animate-pulse" />
        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-sans drop-shadow-md">Scroll</span>
      </div>

      {/* --- BOTTOM CORNER DETAILS (Desktop only) --- */}
      <div className={cn(
        "hidden md:block absolute bottom-8 left-8 transition-opacity duration-1000 delay-1500",
        isReady ? "opacity-100" : "opacity-0"
      )}>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/60">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
          <span>Downtown Los Angeles</span>
        </div>
      </div>

      <div className={cn(
        "hidden md:block absolute bottom-8 right-8 transition-opacity duration-1000 delay-1500",
        isReady ? "opacity-100" : "opacity-0"
      )}>
        <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
          Open Daily 6am — 10pm PST
        </div>
      </div>

    </section>
  );
}