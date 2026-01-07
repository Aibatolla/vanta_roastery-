import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../lib/utils';

// Helper component for highlighted words with "Breathing" animation
const Highlight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-block text-amber-500 font-bold drop-shadow-sm animate-text-live-glow">
    {children}
  </span>
);

const STEPS = [
  {
    id: '01',
    title: "The Alchemy",
    short: "Alchemy",
    desc: (
      <>
        It begins before the bean is ground. The <Highlight>precision</Highlight>, the <Highlight>heat</Highlight>, the <Highlight>transformation</Highlight>. We set the stage for a sensory journey unlike any other.
      </>
    ),
    img: "https://unsplash.com/photos/59soxHWg_0Q/download?force=true&w=1920",
    position: "center center",
  },
  {
    id: '02',
    title: "The Bloom",
    short: "Bloom",
    desc: (
      <>
        The <Highlight>awakening</Highlight>. Hot water meets grounds, releasing CO2 in a mesmerizing expansion. This <Highlight>thirty-second pause</Highlight> defines the cup's clarity.
      </>
    ),
    img: "https://unsplash.com/photos/zpdBAdoevGc/download?force=true&w=1920",
    position: "center 30%",
  },
  {
    id: '03',
    title: "The Pour",
    short: "Pour",
    desc: (
      <>
        <Highlight>Controlled turbulence</Highlight>. A spiral motion maintains thermal stability, coaxing out <Highlight>sweetness</Highlight> and <Highlight>acidity</Highlight> in a delicate, rhythmic balance.
      </>
    ),
    img: "https://unsplash.com/photos/OVFaCEhKvjg/download?force=true&w=1920",
    position: "center 30%",
  },
  {
    id: '04',
    title: "The Finish",
    short: "Finish",
    desc: (
      <>
        <Highlight>Time stands still</Highlight>. The result is a complex, <Highlight>tea-like body</Highlight> with lingering floral notes. Not just a drink, but a moment of absolute presence.
      </>
    ),
    img: "https://unsplash.com/photos/ivWZ5_r1ouo/download?force=true&w=1920",
    position: "center center",
  }
];

export const TheRitual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  // Manual Navigation Handler
  const scrollToStep = (index: number) => {
    if (!containerRef.current) return;
    const containerHeight = containerRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollableDistance = containerHeight - windowHeight;

    const targetScroll = containerRef.current.offsetTop + (scrollableDistance * (index / (STEPS.length - 0.99)));

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    // 1. Setup Intersection Observer for Entry Animation
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setHasEntered(true);
        }
      },
      { threshold: 0.1 } // Trigger when 10% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 2. Setup Scroll Handler
    const handleScroll = () => {
      if (!containerRef.current || !stickyRef.current) return;

      const container = containerRef.current;
      const sticky = stickyRef.current;

      const containerTop = container.offsetTop;
      const containerHeight = container.offsetHeight;
      const stickyHeight = sticky.offsetHeight;
      const scrollY = window.scrollY;

      const scrollDist = scrollY - containerTop;
      const maxScroll = containerHeight - stickyHeight;

      let newProgress = scrollDist / maxScroll;
      newProgress = Math.max(0, Math.min(1, newProgress));

      setProgress(newProgress);

      const stepIndex = Math.min(
        STEPS.length - 1,
        Math.floor(newProgress * STEPS.length + 0.1) // Bias slightly forward
      );

      if (stepIndex !== activeStep) {
        setActiveStep(stepIndex);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    }
  }, [activeStep]);

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#0a0908]"
      style={{ height: `350vh` }}
    >
      <div
        ref={stickyRef}
        className={cn(
          "sticky top-0 w-full h-dvh flex flex-col md:flex-row overflow-hidden transition-all duration-1000 ease-out",
          // ENTRY ANIMATION: Fade in and slide up slightly when scrolling from Hero
          hasEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-24"
        )}
      >
        {/* --- LEFT: VISUALS (PARALLAX CARD STACK) --- */}
        <div className="relative w-full md:w-1/2 h-full overflow-hidden bg-black shadow-2xl z-10">

          {STEPS.map((step, idx) => {
            // CHANGED: Removed the 'slide-up' logic. 
            // Now using a high-end, simple opacity fade.
            const isBase = idx === 0;
            const isVisible = activeStep >= idx;

            // Base always stays. Others fade in.
            const opacity = isBase ? 1 : (isVisible ? 1 : 0);
            // Subtle scale effect (1.1 -> 1.0) on reveal to keep it alive
            const scale = isVisible ? 'scale(1)' : 'scale(1.1)';

            return (
              <div
                key={`img-${step.id}`}
                className={cn(
                  "absolute inset-0 w-full h-full will-change-transform will-change-opacity",
                  "transition-all duration-[1500ms] ease-in-out", // Luxury duration
                )}
                style={{
                  zIndex: idx * 10,
                  transform: scale,
                  opacity: opacity
                }}
              >
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: step.position }}
                />

                {/* Subtle scrim for text readability if needed */}
                <div className="absolute inset-0 bg-black/10" />
              </div>
            );
          })}

          {/* Particles (Optional, subtle dust) */}
          <div className="absolute inset-0 z-[100] pointer-events-none mix-blend-screen opacity-50">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/20 rounded-full blur-[1px] animate-dust-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2}px`,
                  height: `${Math.random() * 2}px`,
                  animationDuration: `${Math.random() * 10 + 20}s`,
                }}
              />
            ))}
          </div>

          <div className="absolute top-6 left-6 z-[100]">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/90 border border-white/20 px-3 py-1 rounded-sm backdrop-blur-md shadow-2xl font-medium bg-black/20">
              The Ritual
            </span>
          </div>

          {/* Mobile Overlay Gradient */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[80%] md:hidden z-[90] pointer-events-none"
            style={{ background: 'linear-gradient(to top, #0a0908 0%, #0a0908 30%, rgba(10,9,8,0.7) 60%, transparent 100%)' }}
          />
        </div>

        {/* --- RIGHT: TEXT CONTENT --- */}
        <div className="absolute inset-0 md:relative md:inset-auto w-full md:w-1/2 h-full z-30 pointer-events-none md:pointer-events-auto bg-transparent md:bg-[#0a0908] flex flex-col justify-end md:justify-center">

          <div className="relative w-full h-[60%] md:h-full flex items-center justify-center">
            {STEPS.map((step, idx) => {
              const isActive = idx === activeStep;

              return (
                <div
                  key={`text-${step.id}`}
                  className={cn(
                    "absolute w-full px-6 pb-24 md:pb-0 md:px-24 flex flex-col transition-all duration-400 ease-out",
                    "md:pr-32",
                    isActive
                      ? "opacity-100 z-10 translate-y-0"
                      : "opacity-0 z-0 translate-y-4 pointer-events-none"
                  )}
                >
                  {/* BACKGROUND NUMBER */}
                  <span
                    className={cn(
                      "block font-serif font-black leading-none absolute -z-10 select-none",
                      "text-white/[0.1] md:text-[#1a1816]",
                      "text-[120px] -top-12 -left-2",
                      "md:text-[280px] md:-top-32 md:-left-16",
                    )}
                  >
                    {step.id}
                  </span>

                  <div className="relative max-w-3xl w-full">
                    <div className="overflow-hidden mb-3 md:mb-6">
                      <h3 className={cn(
                        "font-serif tracking-tighter leading-none uppercase drop-shadow-2xl break-words",
                        "text-[2.8rem] md:text-6xl lg:text-7xl",
                        "text-white"
                      )}>
                        {step.title}
                      </h3>
                    </div>

                    <p className={cn(
                      "font-sans font-medium leading-relaxed text-balance text-neutral-200 md:text-neutral-400 text-sm md:text-xl max-w-[95%] md:max-w-lg drop-shadow-md",
                    )}>
                      {step.desc}
                    </p>

                    {/* PREMIUM SELECTION BADGE (UPDATED) */}
                    <div className={cn(
                      "flex items-center gap-4 mt-8 md:mt-12",
                    )}>
                      {/* CHANGED: Removed the 'bg-amber-900/10' circle/sphere wrapper. Just text. */}
                      <span className="text-[10px] uppercase tracking-[0.25em] text-amber-500 font-bold whitespace-nowrap drop-shadow-md">
                        Phase {step.id}
                      </span>

                      {/* CHANGED: Extended luxurious line to w-32/w-48 */}
                      <div className="h-px w-32 md:w-48 bg-gradient-to-r from-amber-500/60 via-amber-200/30 to-transparent" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- INTERACTIVE NAVIGATION (Desktop) --- */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-8 pointer-events-auto">
            {STEPS.map((step, idx) => (
              <button
                key={`nav-${step.id}`}
                onClick={() => scrollToStep(idx)}
                className="group flex items-center justify-end gap-4 outline-none"
              >
                <span className={cn(
                  "text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-500",
                  activeStep === idx
                    ? "text-amber-500 opacity-100 translate-x-0"
                    : "text-neutral-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
                )}>
                  {step.short}
                </span>
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-500 relative",
                  activeStep === idx ? "bg-amber-500 scale-150 shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "bg-neutral-800 group-hover:bg-neutral-500"
                )} />
              </button>
            ))}
          </div>
        </div>

        {/* --- PROGRESS BAR --- */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-white/5 z-50">
          <div
            className="h-full bg-amber-600/60 transition-all duration-200 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </section>
  );
};