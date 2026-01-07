import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

// --- DATA ---
const FLAVORS = [
  {
    name: "Blood Orange",
    type: "Citrus",
    colorClass: "text-orange-400",
    glowClass: "shadow-orange-500/50",
    borderClass: "border-orange-500/50",
    shineClass: "via-orange-400",
    bgGradient: "from-orange-500/20 to-transparent",
    desc: "Zesty Acidity",
    roast: "Light",
    intensity: 3,
    details: {
      origin: "Colombia, Huila",
      elevation: "1,850 MASL",
      process: "Washed Anaerobic",
      brewGuide: "V60: 15g / 250g / 93°C",
      longDesc: "A vibrant explosion of citrus notes characterized by a sparkling acidity. The finish is clean, sweet, and undeniably bright."
    }
  },
  {
    name: "Dark Chocolate",
    type: "Body",
    colorClass: "text-[#D4A373]",
    glowClass: "shadow-[#D4A373]/50",
    borderClass: "border-[#D4A373]/40",
    shineClass: "via-[#D4A373]",
    bgGradient: "from-[#D4A373]/20 to-transparent",
    desc: "Velvety Finish",
    roast: "Dark",
    intensity: 5,
    details: {
      origin: "Brazil, Cerrado",
      elevation: "1,100 MASL",
      process: "Natural",
      brewGuide: "French Press: 20g / 300g / 4min",
      longDesc: "Deep, comforting richness with a heavy body. Notes of 70% cacao and roasted nuts dominate the palate."
    }
  },
  {
    name: "Jasmine",
    type: "Floral",
    colorClass: "text-emerald-300",
    glowClass: "shadow-emerald-400/50",
    borderClass: "border-emerald-400/50",
    shineClass: "via-emerald-300",
    bgGradient: "from-emerald-500/20 to-transparent",
    desc: "Delicate Aroma",
    roast: "Light",
    intensity: 2,
    details: {
      origin: "Ethiopia, Yirgacheffe",
      elevation: "2,100 MASL",
      process: "Washed",
      brewGuide: "Chemex: 30g / 500g / 94°C",
      longDesc: "An ethereal floral bouquet. Tea-like delicacy with clear notes of jasmine, honeysuckle, and bergamot."
    }
  },
  {
    name: "Black Tea",
    type: "Finish",
    colorClass: "text-rose-400",
    glowClass: "shadow-rose-500/50",
    borderClass: "border-rose-500/50",
    shineClass: "via-rose-400",
    bgGradient: "from-rose-500/20 to-transparent",
    desc: "Tannic Structure",
    roast: "Medium",
    intensity: 4,
    details: {
      origin: "Kenya, Nyeri",
      elevation: "1,900 MASL",
      process: "Double Washed",
      brewGuide: "Kalita: 18g / 300g / 96°C",
      longDesc: "Complex and structured. The tannins provide a drying sensation similar to black tea, with a savory undertone."
    }
  },
  {
    name: "Brown Sugar",
    type: "Sweetness",
    colorClass: "text-yellow-400",
    glowClass: "shadow-yellow-500/50",
    borderClass: "border-yellow-500/50",
    shineClass: "via-yellow-400",
    bgGradient: "from-yellow-500/20 to-transparent",
    desc: "Caramel Depth",
    roast: "Medium-Dark",
    intensity: 4,
    details: {
      origin: "Guatemala, Huehue",
      elevation: "1,600 MASL",
      process: "Washed",
      brewGuide: "Espresso: 18g / 36g / 28s",
      longDesc: "Syrupy sweetness reminiscent of caramelized sugar and molasses, perfect for milk-based drinks."
    }
  },
  {
    name: "Dried Cherry",
    type: "Acidity",
    colorClass: "text-red-400",
    glowClass: "shadow-red-500/50",
    borderClass: "border-red-500/50",
    shineClass: "via-red-400",
    bgGradient: "from-red-500/20 to-transparent",
    desc: "Fruit Punch",
    roast: "Medium",
    intensity: 3,
    details: {
      origin: "Costa Rica, Tarrazu",
      elevation: "1,700 MASL",
      process: "Red Honey",
      brewGuide: "Aeropress: Inverted / 15g",
      longDesc: "Punchy fruitiness with a jammy texture. The honey process preserves the mucilage for intense sweetness."
    }
  },
];

export const Atmosphere: React.FC = () => {
  const [active, setActive] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<typeof FLAVORS[0] | null>(null);
  const [mounted, setMounted] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setActive(true), 200);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-cycle logic (4500ms - Adjusted rhythm)
  useEffect(() => {
    // Only pause if actually hovering with a mouse (desktop) or if modal is open.
    if (isHovered || selectedFlavor) return;

    const interval = setInterval(() => {
      setFocusIndex((prev) => (prev + 1) % FLAVORS.length);
    }, 4500); // 4.5 Seconds per item

    return () => clearInterval(interval);
  }, [isHovered, selectedFlavor]);

  const currentFlavor = FLAVORS[focusIndex];

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 flex flex-col items-center justify-start overflow-hidden bg-[#2a1f1a]"
      aria-label="Tasting Notes Section"
    >
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-soft-light transition-transform duration-[40s] ease-linear animate-subtle-zoom"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1610632380989-680fe40816c6?q=80&w=1920&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-colors duration-1000" />

        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {mounted && [...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 blur-[1px]"
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                animation: `floatUp ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `-${Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-radial-gradient-vignette opacity-80" />
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 w-full px-4 md:px-6 flex flex-col items-center">

        {/* --- HEADER --- */}
        <div className={cn(
          "flex flex-col items-center text-center mb-10 md:mb-16 transition-all duration-[1200ms] ease-out",
          active ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-12 blur-sm"
        )}>
          <span className="text-neutral-400 font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-semibold mb-3 drop-shadow-md">
            The Sensory Spectrum
          </span>

          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white tracking-wide mb-5 drop-shadow-2xl">
            TASTE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">DISTINCTION</span>
          </h2>

          <p className="font-sans font-light max-w-md md:max-w-2xl text-sm md:text-2xl leading-relaxed text-white text-balance drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            Every bean tells a story. We roast to highlight the <span className="inline-block bg-gradient-to-r from-[#C47A3A] via-[#FFE5B4] to-[#C47A3A] bg-[length:200%_auto] bg-clip-text text-transparent font-bold animate-shimmer drop-shadow-sm">unique characteristics</span> of each harvest.
          </p>
        </div>

        {/* --- CENTERED HUD (ROAST LEVEL) --- */}
        <div className={cn(
          "relative z-20 flex flex-col items-center justify-center mb-12 transition-all duration-1000 delay-200",
          active ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}>
          <div className="flex flex-col items-center gap-2 p-4 rounded-sm bg-black/40 backdrop-blur-md border border-white/5 ring-1 ring-white/5 animate-shadow-breathe hover:bg-black/50 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-sans tracking-[0.2em] font-bold text-neutral-500 uppercase">
                ROAST LEVEL
              </span>
              <span className="h-px w-6 bg-white/10" />
              <span className={cn(
                "font-serif text-lg tracking-wider transition-colors duration-700 drop-shadow-lg",
                currentFlavor.colorClass
              )}>
                {currentFlavor.roast}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[8px] font-mono text-neutral-600 uppercase">Intensity</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <div
                    key={dot}
                    className={cn(
                      "w-1 h-3 rounded-full transition-all duration-500",
                      dot <= currentFlavor.intensity
                        ? `bg-current ${currentFlavor.colorClass} shadow-[0_0_8px_currentColor] scale-y-110`
                        : "bg-white/10 scale-y-90"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID --- */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 w-full max-w-5xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {FLAVORS.map((flavor, idx) => {
            const isActive = idx === focusIndex;

            return (
              <div
                key={flavor.name}
                style={{ transitionDelay: active ? `${idx * 100}ms` : '0ms' }}
                className={cn(
                  "group relative aspect-square md:aspect-[4/3] overflow-hidden rounded-md cursor-pointer transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
                  "bg-[#141210]/60 backdrop-blur-sm border tap-highlight-transparent",
                  active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16",
                  isActive
                    ? `${flavor.borderClass} bg-gradient-to-b ${flavor.bgGradient} scale-110 shadow-[0_15px_50px_-10px_rgba(0,0,0,0.6)] z-10`
                    : "border-white/5 hover:border-white/20 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl z-0"
                )}
                onClick={() => {
                  setFocusIndex(idx);
                  setSelectedFlavor(flavor);
                }}
              >
                {isActive && (
                  <div className="absolute inset-0 pointer-events-none z-[1]">
                    <div className={cn(
                      "absolute inset-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-45 animate-border-shine opacity-60",
                      flavor.shineClass
                    )} />
                  </div>
                )}

                <div className={cn(
                  "absolute inset-0 transition-opacity duration-700 pointer-events-none",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-30"
                )}>
                  <div className={cn("absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-radial-gradient from-current to-transparent opacity-10 blur-3xl animate-pulse", flavor.colorClass)} />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20 text-center transform transition-transform duration-700 group-hover:scale-105">
                  <span className={cn(
                    "font-sans text-[8px] md:text-[9px] uppercase tracking-[0.2em] mb-2 transition-all duration-500",
                    isActive ? `${flavor.colorClass} font-bold drop-shadow-md` : "text-neutral-500 group-hover:text-neutral-300"
                  )}>
                    {flavor.type}
                  </span>

                  <span className={cn(
                    "font-serif text-xl md:text-2xl transition-all duration-500 tracking-wide",
                    isActive
                      ? `text-white ${flavor.glowClass} animate-text-breathe drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`
                      : "text-neutral-300 group-hover:text-white"
                  )}>
                    {flavor.name}
                  </span>

                  <span className={cn(
                    "font-sans text-[9px] md:text-[10px] font-medium mt-3 transform transition-all duration-500",
                    isActive || isHovered
                      ? `opacity-100 translate-y-0 ${isActive ? flavor.colorClass : 'text-neutral-400'}`
                      : "opacity-0 translate-y-4"
                  )}>
                    {flavor.desc}
                  </span>

                  {/* --- DESKTOP HOVER CTA --- */}
                  <div className={cn(
                    "hidden md:flex absolute bottom-4 items-center gap-1.5 transition-all duration-500",
                    isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    <span className="text-[9px] uppercase tracking-widest font-semibold text-amber-500">
                      View Composition
                    </span>
                    <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* --- MOBILE HINT --- */}
        <div className={cn(
          "md:hidden mt-8 flex items-center gap-2 animate-pulse transition-opacity duration-700 delay-1000",
          active ? "opacity-70" : "opacity-0"
        )}>
          <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-medium">
            Tap card for details
          </span>
        </div>
      </div>

      {/* --- MODAL --- */}
      {selectedFlavor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-[#0c0a09]/90 backdrop-blur-md animate-fade-in cursor-pointer transition-colors duration-300 hover:bg-[#0c0a09]/95"
            onClick={() => setSelectedFlavor(null)}
          />

          <div className="relative w-full max-w-lg bg-[#141210] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.9)] rounded-sm p-6 md:p-8 animate-slide-up overflow-hidden pointer-events-auto">
            <div className={cn("absolute top-0 left-0 w-full h-1", selectedFlavor.colorClass.replace('text-', 'bg-'))} />

            <div className="relative z-10 flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-[9px] font-sans tracking-[0.2em] uppercase font-bold", selectedFlavor.colorClass)}>
                    {selectedFlavor.type}
                  </span>
                  <span className="h-px w-8 bg-white/10" />
                  <span className="text-[9px] font-mono text-neutral-500">{selectedFlavor.roast} Roast</span>
                </div>
                <h3 className={cn("text-3xl md:text-5xl font-serif mt-1 drop-shadow-xl", selectedFlavor.colorClass)}>
                  {selectedFlavor.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFlavor(null)}
                className="p-2 -mr-2 text-neutral-500 hover:text-white transition-all duration-300 hover:rotate-90 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-y-6 gap-x-4 mb-8 border-y border-white/5 py-8">
              <div>
                <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5">Origin</h4>
                <p className="text-neutral-200 font-serif text-lg">{selectedFlavor.details.origin}</p>
              </div>
              <div>
                <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5">Process</h4>
                <p className="text-neutral-200 font-serif text-lg">{selectedFlavor.details.process}</p>
              </div>
              <div className="col-span-2">
                <h4 className="text-[9px] uppercase tracking-widest text-neutral-500 mb-1.5">Brew Guide</h4>
                <p className={cn("font-mono text-xs", selectedFlavor.colorClass)}>{selectedFlavor.details.brewGuide}</p>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-neutral-300 font-light leading-relaxed text-sm md:text-base">
                {selectedFlavor.details.longDesc}
              </p>
            </div>

            <div className="mt-8 pt-6 flex justify-between items-end border-t border-white/5">
              <span className="font-serif text-neutral-600 text-xs italic">
                Vanta Lot No. {selectedFlavor.name.charCodeAt(0) + selectedFlavor.name.length * 17}
              </span>
              <button className={cn("group flex items-center gap-2 text-xs uppercase tracking-widest text-white transition-colors", `hover:${selectedFlavor.colorClass}`)}>
                Shop This Profile
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* No gradients needed - same background color as adjacent sections */}
    </section>
  );
};