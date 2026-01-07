import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../lib/utils';

// Flavor data - added interesting unique notes
const FLAVORS = [
    { name: 'Oak', target: 90 },
    { name: 'Caramel', target: 85 },
    { name: 'Vanilla', target: 70 },
    { name: 'Smoke', target: 60 },
    { name: 'Honey', target: 50 },
    { name: 'Dark Cherry', target: 45 },
    { name: 'Tobacco Leaf', target: 35 },
];

interface LimitedEditionProps {
    onOpenReservation?: () => void;
}

export const LimitedEdition: React.FC<LimitedEditionProps> = ({ onOpenReservation }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasEntered, setHasEntered] = useState(false);
    const [bagsLeft, setBagsLeft] = useState(47);
    const [flavorValues, setFlavorValues] = useState<number[]>([]);

    // Set video speed to 1.4x
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 1.4;
        }
    }, [hasEntered]);

    useEffect(() => {
        // Initialize with zeros
        setFlavorValues(FLAVORS.map(() => 0));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setHasEntered(true);
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Smooth animate flavor percentages using requestAnimationFrame
    useEffect(() => {
        if (!hasEntered) return;

        const duration = 2500; // 2.5 seconds
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);

            setFlavorValues(FLAVORS.map(f => Math.round(f.target * eased)));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [hasEntered]);

    // Animate bags countdown 47 -> 46 after section enters view
    useEffect(() => {
        if (!hasEntered) return;

        const timer = setTimeout(() => {
            setBagsLeft(46);
        }, 4000); // After 4 seconds, decrease to 46

        return () => clearTimeout(timer);
    }, [hasEntered]);

    return (
        <section
            ref={sectionRef}
            id="limited"
            className="relative min-h-screen w-full overflow-hidden bg-[#0a0908]"
            aria-label="Limited Edition"
        >
            {/* Desktop decorative glow orbs */}
            <div className="hidden lg:block absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
            <div className="hidden lg:block absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-600/8 blur-[100px] pointer-events-none" />
            <div className="hidden lg:block absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-orange-500/5 blur-[80px] pointer-events-none" />

            <style>{`
                @keyframes float-product {
                    0%, 100% { transform: translateY(0) rotate(-1deg); }
                    50% { transform: translateY(-12px) rotate(1deg); }
                }
                @keyframes vapor {
                    0% { opacity: 0; transform: translateY(0) scale(1); }
                    50% { opacity: 0.25; }
                    100% { opacity: 0; transform: translateY(-80px) scale(1.3); }
                }
                @keyframes soft-glow {
                    0%, 100% { box-shadow: 0 0 30px rgba(255,255,255,0.03); }
                    50% { box-shadow: 0 0 50px rgba(255,255,255,0.08); }
                }
                @keyframes text-breathe {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 1; }
                }
                @keyframes subtle-pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes badge-glow {
                    0%, 100% { 
                        box-shadow: 0 0 10px rgba(251,191,36,0.2), inset 0 0 10px rgba(251,191,36,0.1);
                        border-color: rgba(251,191,36,0.3);
                    }
                    50% { 
                        box-shadow: 0 0 25px rgba(251,191,36,0.4), inset 0 0 15px rgba(251,191,36,0.15);
                        border-color: rgba(251,191,36,0.5);
                    }
                }
                @keyframes slide-up {
                    0% { opacity: 0; transform: translateY(40px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                @keyframes number-pop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
                .float-product {
                    animation: float-product 8s ease-in-out infinite;
                }
                .soft-glow {
                    animation: soft-glow 5s ease-in-out infinite;
                }
                .text-breathe {
                    animation: text-breathe 4s ease-in-out infinite;
                }
                .subtle-pulse {
                    animation: subtle-pulse 2s ease-in-out infinite;
                }
                .badge-glow {
                    animation: badge-glow 3s ease-in-out infinite;
                }
                .slide-up {
                    animation: slide-up 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                .fade-in {
                    animation: fade-in 1.5s ease-out forwards;
                }
                .number-pop {
                    animation: number-pop 0.5s ease-out;
                }
            `}</style>

            {/* Background: Video - FULL VISIBILITY */}
            <div className={cn(
                "absolute inset-0 z-0 transition-opacity duration-1000",
                hasEntered ? "opacity-100" : "opacity-0"
            )}>
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-50"
                >
                    <source src="/videos/whiskey.mp4" type="video/mp4" />
                </video>

                {/* Overlays - softer for video visibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0908]/70 via-transparent to-[#0a0908]/80" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0908]/80 via-transparent to-transparent lg:from-[#0a0908]/90 lg:via-[#0a0908]/30 lg:to-transparent" />
            </div>

            {/* Vapor particles */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-amber-500/10"
                        style={{
                            left: `${20 + Math.random() * 60}%`,
                            bottom: `${Math.random() * 30}%`,
                            width: `${8 + Math.random() * 16}px`,
                            height: `${8 + Math.random() * 16}px`,
                            animation: `vapor ${10 + Math.random() * 8}s ease-out infinite`,
                            animationDelay: `${Math.random() * 6}s`,
                            filter: 'blur(6px)',
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-20 min-h-screen flex items-center">
                <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">

                        {/* Left: Text content - full width on desktop */}
                        <div className="order-2 lg:order-1 lg:col-span-5 max-w-2xl">
                            {/* Badge - PREMIUM GLOWING */}
                            <div
                                className={cn("mb-8 opacity-0", hasEntered && "slide-up")}
                                style={{ animationDelay: '100ms' }}
                            >
                                <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-amber-400 border border-amber-500/40 px-5 py-2.5 rounded-full backdrop-blur-sm bg-amber-500/10 badge-glow">
                                    <span className="w-2 h-2 rounded-full bg-amber-400 subtle-pulse" />
                                    Limited Release
                                    <span className="w-2 h-2 rounded-full bg-amber-400 subtle-pulse" style={{ animationDelay: '1s' }} />
                                </span>
                            </div>

                            {/* Title with living keywords - amber accents */}
                            <div
                                className={cn("mb-6 opacity-0", hasEntered && "slide-up")}
                                style={{ animationDelay: '200ms' }}
                            >
                                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-[0.9]">
                                    <span className="text-amber-400 text-breathe drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]">Whiskey</span><br />
                                    <span className="text-white/50 text-breathe" style={{ animationDelay: '0.5s' }}>Barrel</span><br />
                                    <span className="text-amber-400 text-breathe drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]" style={{ animationDelay: '1s' }}>Aged</span>
                                </h2>
                            </div>

                            {/* Exclusive note */}
                            <p
                                className={cn("text-amber-500/80 text-[11px] uppercase tracking-[0.35em] mb-6 opacity-0", hasEntered && "slide-up")}
                                style={{ animationDelay: '300ms' }}
                            >
                                ✦ Only at Vanta Roastery ✦
                            </p>

                            {/* Description with living keywords - amber accents */}
                            <p
                                className={cn("text-neutral-300 text-base md:text-lg leading-relaxed mb-10 max-w-lg opacity-0", hasEntered && "slide-up")}
                                style={{ animationDelay: '400ms' }}
                            >
                                Ethiopian beans aged{' '}
                                <span className="text-amber-400 font-semibold text-breathe">90 days</span>{' '}
                                in authentic{' '}
                                <span className="text-amber-400 font-semibold text-breathe" style={{ animationDelay: '0.5s' }}>Kentucky bourbon</span>{' '}
                                barrels. Complex notes of oak and vanilla with whiskey essence.
                            </p>

                            {/* Flavor bars - ENHANCED */}
                            <div
                                className={cn("space-y-4 mb-12 opacity-0", hasEntered && "slide-up")}
                                style={{ animationDelay: '500ms' }}
                            >
                                <span className="text-[9px] uppercase tracking-[0.3em] text-amber-500/70 mb-4 block font-semibold">Tasting Profile</span>
                                {FLAVORS.map((flavor, idx) => (
                                    <div key={flavor.name} className="flex items-center gap-4">
                                        <span className="text-xs text-amber-400/90 w-24 font-medium">{flavor.name}</span>
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${flavorValues[idx] || 0}%`,
                                                    background: 'linear-gradient(90deg, #ffffff, #e5e5e5)',
                                                    boxShadow: '0 0 8px rgba(255,255,255,0.3)',
                                                    transition: 'width 50ms linear'
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-white w-8 text-right tabular-nums font-bold">
                                            {flavorValues[idx] || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Scarcity + CTA */}
                            <div
                                className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-6 opacity-0", hasEntered && "slide-up")}
                                style={{ animationDelay: '700ms' }}
                            >
                                {/* Bags counter - ANIMATED */}
                                <div className="flex items-baseline gap-4 bg-gradient-to-r from-amber-500/10 to-transparent px-6 py-3 rounded-xl border border-amber-500/20">
                                    <span
                                        key={bagsLeft}
                                        className="font-serif text-4xl text-amber-400 font-light number-pop"
                                    >
                                        {bagsLeft}
                                    </span>
                                    <span className="text-white/80 text-sm uppercase tracking-wider">bags remaining</span>
                                </div>

                                {/* CTA - PROMINENT */}
                                <button
                                    onClick={onOpenReservation}
                                    className="group relative px-8 py-4 bg-amber-500 text-black text-xs uppercase tracking-[0.2em] font-bold rounded-full transition-all duration-500 hover:bg-amber-400 hover:scale-105 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
                                >
                                    Reserve Now
                                    <span className="absolute inset-0 rounded-full border-2 border-amber-400/50 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                                </button>
                            </div>
                        </div>

                        {/* Right: Product card - MOBILE ONLY */}
                        <div
                            className={cn("order-1 lg:hidden flex flex-col items-center opacity-0", hasEntered && "fade-in")}
                            style={{ animationDelay: '300ms' }}
                        >
                            {/* Product card - PROPERLY SIZED */}
                            <div className="relative w-full max-w-md">
                                {/* Glow behind */}
                                <div className="absolute inset-0 rounded-2xl bg-amber-600/15 blur-3xl" />

                                <div
                                    className="relative float-product w-full rounded-2xl border border-amber-500/20 backdrop-blur-sm overflow-hidden"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(26,21,16,0.9) 0%, rgba(15,12,8,0.8) 100%)',
                                        boxShadow: '0 0 60px rgba(180, 130, 70, 0.15)'
                                    }}
                                >
                                    {/* Top accent bar */}
                                    <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />

                                    <div className="p-8">
                                        {/* Header with V Logo */}
                                        <div className="flex items-center gap-5 mb-6">
                                            <div className="w-16 h-16 rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-amber-500/10">
                                                <span className="font-serif text-3xl text-amber-400 text-breathe">V</span>
                                            </div>
                                            <div>
                                                <span className="block text-[9px] uppercase tracking-[0.3em] text-amber-500/70 mb-1">The Reserve Collection</span>
                                                <span className="block font-serif text-2xl text-white">Whiskey Barrel</span>
                                                <span className="block font-serif text-xl text-amber-400">Aged</span>
                                            </div>
                                        </div>

                                        {/* Details grid */}
                                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-amber-500/20">
                                            <div>
                                                <span className="block text-[8px] uppercase tracking-[0.25em] text-neutral-500 mb-1">Origin</span>
                                                <span className="block text-sm text-white">Ethiopia · Yirgacheffe</span>
                                            </div>
                                            <div>
                                                <span className="block text-[8px] uppercase tracking-[0.25em] text-neutral-500 mb-1">Process</span>
                                                <span className="block text-sm text-white">90 Days Aged</span>
                                            </div>
                                            <div>
                                                <span className="block text-[8px] uppercase tracking-[0.25em] text-neutral-500 mb-1">Weight</span>
                                                <span className="block text-sm text-amber-400 font-semibold">250g · Whole Bean</span>
                                            </div>
                                            <div>
                                                <span className="block text-[8px] uppercase tracking-[0.25em] text-neutral-500 mb-1">Batch</span>
                                                <span className="block text-sm text-amber-400 font-semibold">Limited Edition</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Corner accents */}
                                    <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-amber-500/20" />
                                    <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-amber-500/20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0908] to-transparent z-30 pointer-events-none" />
        </section>
    );
};
