import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/utils';
import { useMenu } from '../context/MenuContext';

const ORIGINS_DATA = [
    {
        id: 'ethiopia',
        country: 'ETHIOPIA',
        region: 'Yirgacheffe',
        terroirLabel: 'African Highlands',
        primaryFlavor: 'Jasmine',
        flavors: ['Bergamot', 'Honey'],
        roasterNote: '"Pure floral poetry in every cup."',
        roaster: 'Marcus Chen',
        profile: { acidity: 90, body: 40, sweetness: 75 },
        image: '/images/origin-ethiopia.png',
        color: 'text-amber-300',
        accentColor: 'bg-amber-500'
    },
    {
        id: 'colombia',
        country: 'COLOMBIA',
        region: 'Huila',
        terroirLabel: 'Andean Volcanic',
        primaryFlavor: 'Caramel',
        flavors: ['Red Apple', 'Cocoa'],
        roasterNote: '"Our signature balance. Rich yet smooth."',
        roaster: 'Elena Vásquez',
        profile: { acidity: 60, body: 70, sweetness: 80 },
        image: '/images/origin-colombia.png',
        color: 'text-orange-300',
        accentColor: 'bg-orange-500'
    },
    {
        id: 'panama',
        country: 'PANAMA',
        region: 'Boquete',
        terroirLabel: 'Geisha Reserve',
        primaryFlavor: 'Tropical',
        flavors: ['Stone Fruit', 'Vanilla'],
        roasterNote: '"The crown jewel. Worth every sip."',
        roaster: 'James Okonkwo',
        profile: { acidity: 75, body: 50, sweetness: 95 },
        image: '/images/origin-panama.png',
        color: 'text-rose-300',
        accentColor: 'bg-rose-500'
    }
];

export const TheOrigins = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [tiltPos, setTiltPos] = useState({ x: 0.5, y: 0.5 });
    const [isMobile, setIsMobile] = useState(false);
    const { open: openMenu } = useMenu();

    useEffect(() => {
        // Check if mobile
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleScroll = () => {
            if (!sectionRef.current) return;
            const { top, height } = sectionRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            const scrollDistance = -top;
            const totalScrollableHeight = height - viewportHeight;

            if (scrollDistance < 0) {
                setActiveIndex(0);
                setScrollProgress(0);
                return;
            }

            const progress = Math.min(Math.max(scrollDistance / totalScrollableHeight, 0), 0.99);
            const newIndex = Math.floor(progress * ORIGINS_DATA.length);

            setActiveIndex(newIndex);
            setScrollProgress(progress);
        };

        // Desktop: Mouse parallax
        const handleMouseMove = (e: MouseEvent) => {
            if (isMobile) return;
            setTiltPos({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight
            });
        };

        // Mobile: Gyroscope parallax
        const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
            if (!isMobile) return;
            const gamma = e.gamma || 0; // Left-right tilt (-90 to 90)
            const beta = e.beta || 0;   // Front-back tilt (-180 to 180)

            // Normalize to 0-1 range
            setTiltPos({
                x: Math.min(Math.max((gamma + 45) / 90, 0), 1),
                y: Math.min(Math.max((beta + 45) / 90, 0), 1)
            });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('deviceorientation', handleDeviceOrientation);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleDeviceOrientation);
        };
    }, [isMobile]);

    return (
        <section
            id="origins-section"
            ref={sectionRef}
            className="relative w-full h-[300vh] bg-[#2a1f1a]"
        >
            {/* ========= SCROLL PROGRESS BAR (Only visible in this section) ========= */}
            <div
                className={cn(
                    "fixed top-0 left-0 right-0 h-1 z-50 bg-black/30 transition-opacity duration-500",
                    scrollProgress > 0 && scrollProgress < 0.99 ? "opacity-100" : "opacity-0"
                )}
            >
                <div
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 transition-all duration-100 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                    style={{ width: `${scrollProgress * 100}%` }}
                />
            </div>

            {/* ========= STICKY BACKGROUND LAYER ========= */}
            <div className="sticky top-0 w-full h-screen overflow-hidden">
                {/* Background Images - Liquid Transition with Parallax */}
                {ORIGINS_DATA.map((origin, idx) => (
                    <div
                        key={origin.id}
                        className={cn(
                            "absolute inset-0 transition-all duration-1000 ease-out bg-[#0c0a09]",
                            activeIndex === idx
                                ? "opacity-100 z-0 scale-100 blur-0"
                                : "opacity-0 z-0 scale-110 blur-sm"
                        )}
                    >
                        {/* Image with Parallax (works on mobile via gyroscope) */}
                        <img
                            src={origin.image}
                            alt={origin.country}
                            className="w-full h-full object-cover opacity-80 animate-slow-pan transition-transform duration-200 ease-out"
                            style={{
                                transform: `translate(${(tiltPos.x - 0.5) * -20}px, ${(tiltPos.y - 0.5) * -20}px) scale(1.05)`
                            }}
                        />
                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2a1f1a] via-transparent to-[#2a1f1a]/30" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2a1f1a]/90 via-transparent to-[#2a1f1a]/30" />

                        {/* === LIVING ATMOSPHERE LAYERS === */}
                        {/* Ethiopia: Mist - More visible */}
                        {origin.id === 'ethiopia' && (
                            <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent w-[200%] h-full animate-fog" />
                            </div>
                        )}
                        {/* Colombia: Rain/Humid - More visible */}
                        {origin.id === 'colombia' && (
                            <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
                                {[...Array(25)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-[1px] bg-white/60 animate-rain"
                                        style={{
                                            height: `${Math.random() * 25 + 10}%`,
                                            left: `${Math.random() * 100}%`,
                                            animationDelay: `-${Math.random()}s`,
                                            animationDuration: `${0.4 + Math.random() * 0.4}s`
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                        {/* Panama: Sunbeams - More visible */}
                        {origin.id === 'panama' && (
                            <div className="absolute top-0 right-0 w-full h-full opacity-40 mix-blend-screen pointer-events-none overflow-hidden">
                                <div className="absolute top-[-50%] right-[-50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(251,191,36,0.15)_20deg,transparent_40deg,rgba(251,191,36,0.15)_60deg,transparent_80deg)] animate-sunbeam" />
                            </div>
                        )}
                    </div>
                ))}

                {/* ========= PARALLAX TYPOGRAPHY LAYER (BEHIND) ========= */}
                <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
                    {ORIGINS_DATA.map((origin, idx) => (
                        <h1
                            key={origin.id}
                            className={cn(
                                "text-[25vw] font-serif font-bold text-white/[0.03] whitespace-nowrap transition-transform duration-1000 ease-out absolute", // Reduced opacity to 0.03
                                activeIndex === idx ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-32 scale-90"
                            )}
                        >
                            {origin.country}
                        </h1>
                    ))}
                </div>

                {/* ========= ATMOSPHERE LAYER (Subtle Dust) ========= */}
                <div className="absolute inset-0 z-[5] pointer-events-none">
                    {/* Floating Dust Particles - Very subtle now */}
                    <div className="absolute inset-0">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-white/10 blur-[0.5px] animate-float-particle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 2 + 1}px`, // Smaller size
                                    height: `${Math.random() * 2 + 1}px`,
                                    animationDuration: `${Math.random() * 15 + 15}s`, // Slower
                                    animationDelay: `-${Math.random() * 10}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* ========= FOREGROUND CONTENT ========= */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-20 lg:px-32">
                    <div className="max-w-4xl w-full">
                        {/* Content Switcher */}
                        {ORIGINS_DATA.map((origin, idx) => (
                            <div
                                key={origin.id}
                                className={cn(
                                    "transition-all duration-1000 w-full",
                                    activeIndex === idx
                                        ? "opacity-100 blur-0"
                                        : "opacity-0 blur-sm absolute pointer-events-none"
                                )}
                            >
                                {/* Top Bar: Counter + by VANTA */}
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-sm md:text-base text-amber-400 font-mono animate-underline tracking-wider font-medium">
                                        by VANTA
                                    </span>
                                    <span className="text-xs text-white/40 font-mono">
                                        <span className="text-white/70 text-sm font-medium">0{idx + 1}</span>
                                        <span className="mx-1">/</span>
                                        <span>0{ORIGINS_DATA.length}</span>
                                    </span>
                                </div>

                                {/* Country Name - BIG */}
                                <h1 className="text-6xl md:text-9xl lg:text-[10rem] font-serif text-[#F5F0EB] leading-[0.85] drop-shadow-2xl animate-float mb-2">
                                    {origin.country}
                                </h1>
                                <div className={cn("text-lg md:text-2xl font-serif mb-6 opacity-80", origin.color)}>
                                    {origin.region}
                                </div>

                                {/* Primary Flavor - Accent */}
                                <div className="mb-4">
                                    <span className={cn(
                                        "inline-block px-5 py-2.5 rounded-full text-base md:text-lg font-medium border-2",
                                        origin.color, "border-current bg-white/5 backdrop-blur-sm",
                                        activeIndex === idx ? "animate-fade-in-up" : "opacity-0"
                                    )}>
                                        <span className="opacity-70 mr-1.5">◆</span> {origin.primaryFlavor}
                                    </span>
                                </div>

                                {/* Secondary Flavor Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {origin.flavors.map((flavor, i) => (
                                        <span
                                            key={flavor}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-xs backdrop-blur-sm border",
                                                "bg-white/5 border-white/10 text-white/70",
                                                "hover:border-white/30 transition-all duration-300",
                                                activeIndex === idx ? "animate-fade-in-up" : "opacity-0"
                                            )}
                                            style={{
                                                animationDelay: activeIndex === idx ? `${200 + i * 100}ms` : '0ms',
                                                animationFillMode: 'forwards'
                                            }}
                                        >
                                            {flavor}
                                        </span>
                                    ))}
                                </div>

                                {/* Taste Profile Bars - Smooth animated fill */}
                                <div className="grid grid-cols-3 gap-6 mb-8 max-w-md">
                                    {[
                                        { label: 'Acidity', value: origin.profile.acidity },
                                        { label: 'Body', value: origin.profile.body },
                                        { label: 'Sweetness', value: origin.profile.sweetness }
                                    ].map((stat, i) => (
                                        <div key={stat.label}>
                                            <div className="flex justify-between items-baseline mb-1.5">
                                                <span className="text-[10px] md:text-xs text-white/70 uppercase tracking-widest font-medium">{stat.label}</span>
                                                <span className="text-xs text-white/80 font-mono">{stat.value}</span>
                                            </div>
                                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all ease-out",
                                                        origin.accentColor,
                                                        activeIndex === idx ? "duration-[1200ms]" : "duration-0"
                                                    )}
                                                    style={{
                                                        width: activeIndex === idx ? `${stat.value}%` : '0%',
                                                        transitionDelay: activeIndex === idx ? `${300 + i * 150}ms` : '0ms'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Roaster's Note - Clean, minimal */}
                                <div className="bg-black/30 backdrop-blur-md rounded-lg p-4 md:p-5 border border-white/5 max-w-lg mb-6">
                                    <p className="text-base md:text-lg italic text-white/85 font-serif mb-3 leading-relaxed">
                                        {origin.roasterNote}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono uppercase tracking-wider text-white/50">—</span>
                                        <span
                                            className={cn(
                                                "text-sm md:text-base font-semibold tracking-wide",
                                                origin.color,
                                                activeIndex === idx && "drop-shadow-[0_0_8px_currentColor]"
                                            )}
                                        >
                                            {origin.roaster.split('').map((char, i) => (
                                                <span
                                                    key={i}
                                                    className={cn(
                                                        "inline-block transition-all duration-300",
                                                        activeIndex === idx
                                                            ? "translate-y-0 opacity-100 scale-100"
                                                            : "translate-y-2 opacity-0 scale-90"
                                                    )}
                                                    style={{
                                                        transitionDelay: activeIndex === idx ? `${400 + i * 30}ms` : '0ms'
                                                    }}
                                                >
                                                    {char === ' ' ? '\u00A0' : char}
                                                </span>
                                            ))}
                                        </span>
                                        <span className="text-xs font-mono uppercase tracking-wider text-white/40">, Head Roaster</span>
                                    </div>
                                </div>

                                {/* CTA Button - Smaller */}
                                <button
                                    onClick={openMenu}
                                    className={cn(
                                        "group px-4 py-2 rounded-full border text-xs font-medium uppercase tracking-wider",
                                        "bg-transparent hover:bg-white/10 transition-all duration-300",
                                        origin.color, "border-current",
                                        "flex items-center gap-1.5"
                                    )}>
                                    <span>Order</span>
                                    <span className="group-hover:translate-x-0.5 transition-transform text-[10px]">→</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Indicators - BOTTOM CENTER */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-row gap-3 z-30">
                    {ORIGINS_DATA.map((origin, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                "h-1 transition-all duration-500 rounded-full",
                                activeIndex === idx ? "w-12 bg-amber-500" : "w-3 bg-white/20"
                            )}
                        />
                    ))}
                </div>

                {/* Scroll Indicator - Shows on first slide */}
                <div
                    className={cn(
                        "absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30 transition-all duration-700",
                        activeIndex === 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                    )}
                >
                    <span className="text-[10px] text-white/50 uppercase tracking-widest font-mono">↓ Scroll ↓</span>
                </div>

                {/* Dividers added via App.tsx */}
            </div>
        </section>
    );
};
