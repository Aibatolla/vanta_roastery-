import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '../lib/utils';
import { useMenu } from '../context/MenuContext';

// ============================================
// CERTIFICATIONS DATA
// ============================================
const CERTIFICATIONS = [
    { name: 'SCA Certified', score: '86+' },
    { name: 'Direct Trade', score: '100%' },
    { name: 'Single Origin', score: 'Always' },
    { name: 'Small Batch', score: '<200' },
    { name: 'Fresh Roasted', score: '48h' },
    { name: 'Family Farms', score: '4th Gen' }
];

// ============================================
// JS-BASED MARQUEE COMPONENT
// ============================================
const CertificationsMarquee: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const positionRef = useRef(0);

    useEffect(() => {
        const scrollEl = scrollRef.current;
        if (!scrollEl || !isVisible) return;

        let animationId: number;

        const animate = () => {
            positionRef.current -= 0.4; // pixels per frame

            const halfWidth = scrollEl.scrollWidth / 2;
            if (Math.abs(positionRef.current) >= halfWidth) {
                positionRef.current = 0;
            }

            scrollEl.style.transform = `translateX(${positionRef.current}px)`;
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [isVisible]);

    const doubled = [...CERTIFICATIONS, ...CERTIFICATIONS];

    return (
        <div className={cn(
            "relative overflow-hidden mb-16 py-6 opacity-0 transition-all duration-1000",
            isVisible && "opacity-100"
        )} style={{ transitionDelay: '600ms' }}>
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-r from-[#2a1f1a] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-l from-[#2a1f1a] to-transparent z-10" />

            <div
                ref={scrollRef}
                className="flex items-center gap-8 md:gap-12 will-change-transform"
            >
                {doubled.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                        <div className="flex flex-col items-center">
                            <span className="text-xl md:text-3xl font-serif text-amber-400">{item.score}</span>
                            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-[#8B7355] mt-1">{item.name}</span>
                        </div>
                        <div className="w-px h-6 md:h-8 bg-gradient-to-b from-transparent via-[#8B7355]/30 to-transparent" />
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================
// HIGHLIGHT COMPONENT FOR KEYWORDS
// ============================================
const Highlight: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <span className="inline-block text-[#8B4513] font-bold drop-shadow-sm animate-text-live-glow">
        {children}
    </span>
);

// ============================================
// MEDIA PLACEHOLDER COMPONENT
// Replace 'src' prop with your actual image/video URL
// ============================================
interface MediaPlaceholderProps {
    type: 'image' | 'video';
    src?: string;
    alt?: string;
    className?: string;
    placeholderText?: string;
}

const MediaPlaceholder: React.FC<MediaPlaceholderProps> = ({
    type,
    src,
    alt = 'Media',
    className = '',
    placeholderText = 'ADD PHOTO/VIDEO'
}) => {
    const [isInView, setIsInView] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    // Smooth zoom animation on mobile when scrolling into view
    useEffect(() => {
        if (!src || type !== 'image') return;

        const element = imageRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                } else {
                    // Reset when out of view for re-animation
                    setIsInView(false);
                }
            },
            {
                threshold: 0.3, // Trigger when 30% visible
                rootMargin: '-50px 0px' // Slight offset
            }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [src, type]);

    if (src) {
        if (type === 'video') {
            return (
                <video
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    className={cn('w-full h-full object-cover', className)}
                />
            );
        }
        return (
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                className={cn(
                    'w-full h-full object-cover transition-transform duration-1000 ease-out',
                    // Mobile: zoom in smoothly when in view
                    'md:transform-none', // Desktop keeps hover behavior
                    isInView ? 'scale-110' : 'scale-100',
                    className
                )}
            />
        );
    }

    // Placeholder when no media is provided
    return (
        <div className={cn(
            'w-full h-full flex items-center justify-center bg-gradient-to-br from-[#d4c4b0] to-[#c9b89d] border-2 border-dashed border-[#8B4513]/30',
            className
        )}>
            <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8B4513]/20 flex items-center justify-center">
                    {type === 'video' ? (
                        <svg className="w-8 h-8 text-[#6B4423]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    ) : (
                        <svg className="w-8 h-8 text-[#6B4423]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#6B4423] font-semibold">
                    {placeholderText}
                </span>
            </div>
        </div>
    );
};

// ============================================
// JOURNEY STEPS DATA
// ============================================
const JOURNEY_STEPS = [
    {
        number: '01',
        title: 'Origin',
        description: (
            <>
                <Highlight>Volcanic highlands</Highlight> at 2000m+ in <Highlight>Ethiopia</Highlight>, <Highlight>Colombia</Highlight>, and <Highlight>Guatemala</Highlight>. Direct partnerships with 4th-generation family farms.
            </>
        ),
        imageSrc: '/images/origin.jpg'
    },
    {
        number: '02',
        title: 'Select',
        description: (
            <>
                <Highlight>Hand-sorted</Highlight>, triple cupped. Only beans scoring <Highlight>86+ SCA</Highlight> make the cut — less than <Highlight>1%</Highlight> of global production.
            </>
        ),
        imageSrc: '/images/select.jpg'
    },
    {
        number: '03',
        title: 'Roast',
        description: (
            <>
                Small <Highlight>12kg batches</Highlight> on our <Highlight>German Probat</Highlight>. Profile-roasted to highlight each origin's <Highlight>unique character</Highlight>.
            </>
        ),
        imageSrc: '/images/roast.jpg'
    },
    {
        number: '04',
        title: 'Deliver',
        description: (
            <>
                Sealed in <Highlight>nitrogen-flushed</Highlight> bags to lock freshness. From roaster to your door in under <Highlight>48 hours</Highlight>.
            </>
        ),
        imageSrc: '/images/delivery.jpg'
    }
];

// ============================================
// COMPARISON DATA
// ============================================
const COMPARISON_DATA = [
    { ordinary: 'Mass production', vanta: 'Micro-lots (<200 bags)' },
    { ordinary: 'Roasted months ago', vanta: 'Roasted to order' },
    { ordinary: 'Commercial grade', vanta: 'Specialty Grade (86+ SCA)' },
    { ordinary: 'Generic taste', vanta: 'Unique terroir of each region' },
    { ordinary: 'Unknown origin', vanta: 'Direct Trade, 100% transparency' }
];

// ============================================
// STATS DATA
// ============================================
const STATS_DATA = [
    { value: 86, suffix: '+', label: 'SCA Score', description: 'Specialty Grade' },
    { value: 2000, suffix: 'm+', label: 'Altitude', description: 'Highland Farms' },
    { value: 48, suffix: 'h', label: 'Delivery', description: 'From Roast' },
    { value: 1, suffix: '%', label: 'Selection', description: 'Global Beans' }
];

// ============================================
// ANIMATED COUNTER COMPONENT
// ============================================
const AnimatedCounter: React.FC<{
    value: number;
    suffix: string;
    duration?: number;
    isVisible: boolean;
    delay?: number;
}> = ({ value, suffix, duration = 2500, isVisible, delay = 0 }) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        if (!isVisible) {
            setCount(0);
            setHasStarted(false);
            return;
        }

        // Delay before starting animation
        const startTimeout = setTimeout(() => {
            setHasStarted(true);
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [isVisible, delay]);

    useEffect(() => {
        if (!hasStarted) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (startTime === null) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth easing - starts slow, speeds up, then slows at end
            const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const newCount = Math.round(easeOutExpo * value);
            setCount(newCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(value); // Ensure final value is exact
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [hasStarted, value, duration]);

    return (
        <span className="tabular-nums">
            {count}{suffix}
        </span>
    );
};



// ============================================
// MAIN COMPONENT
// ============================================
export const TheStandard: React.FC = () => {
    const { open: openMenu } = useMenu();
    const sectionRef = useRef<HTMLElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Separate observer for stats to trigger counter when user scrolls to it
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStatsVisible(true);
                }
            },
            { threshold: 0.4 } // Trigger when 40% visible
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-[#2a1f1a] overflow-hidden"
            aria-label="The Standard Section"
        >
            {/* Dividers handled in App.tsx */}

            {/* ========== ANIMATED BACKGROUND ========== */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Vertical rising steam lines - Enhanced Visibility */}
                {[10, 25, 40, 50, 60, 75, 90].map((left, i) => (
                    <div
                        key={`steam-${i}`}
                        className="absolute bottom-0 w-[2px] opacity-0"
                        style={{
                            left: `${left}%`,
                            height: '100%',
                            background: 'linear-gradient(to top, rgba(245, 158, 11, 0.4), rgba(212, 165, 116, 0.15), transparent 80%)',
                            animation: `steam-rise-simple ${7 + i}s ease-in-out infinite`,
                            animationDelay: `${-i * 2}s`, // Negative delay means it starts "already running"
                        }}
                    />
                ))}

                {/* Horizontal flowing lines - Enhanced */}
                <div
                    className="absolute left-0 right-0 h-[2px] opacity-40"
                    style={{
                        top: '20%',
                        background: 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.3), transparent)',
                        animation: 'flow-line 12s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute left-0 right-0 h-[2px] opacity-30"
                    style={{
                        top: '45%',
                        background: 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.25), transparent)',
                        animation: 'flow-line 18s ease-in-out infinite reverse',
                    }}
                />
                <div
                    className="absolute left-0 right-0 h-[2px] opacity-20"
                    style={{
                        top: '70%',
                        background: 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.2), transparent)',
                        animation: 'flow-line 15s ease-in-out infinite',
                        animationDelay: '-5s',
                    }}
                />

                {/* Subtle glow spots */}
                <div
                    className="absolute w-64 h-64 rounded-full opacity-10"
                    style={{
                        top: '20%',
                        left: '10%',
                        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3), transparent 70%)',
                        animation: 'pulse-glow 8s ease-in-out infinite',
                    }}
                />
                <div
                    className="absolute w-96 h-96 rounded-full opacity-5"
                    style={{
                        bottom: '30%',
                        right: '5%',
                        background: 'radial-gradient(circle, rgba(212, 165, 116, 0.4), transparent 70%)',
                        animation: 'pulse-glow 12s ease-in-out infinite',
                        animationDelay: '4s',
                    }}
                />
            </div>


            {/* ========== BLOCK 1: SECTION INTRO ========== */}
            <div className="relative w-full pt-32 pb-12 px-4 md:px-8">
                {/* Text Content */}
                <div className="flex flex-col items-center justify-center text-center">
                    <span className={cn(
                        "text-xs md:text-sm uppercase tracking-[0.4em] text-amber-500/80 font-semibold mb-6 opacity-0 transition-all duration-1000",
                        isVisible && "opacity-100"
                    )}>
                        Why Vanta
                    </span>
                    <h2 className={cn(
                        "font-serif text-6xl md:text-8xl lg:text-9xl text-[#F5F0EB] tracking-tight opacity-0 transition-all duration-1000 delay-200",
                        isVisible && "opacity-100 animate-title-reveal"
                    )}>
                        The <span className="text-amber-400 animate-pulse-slow">Standard</span>
                    </h2>
                </div>
            </div>

            {/* ========== BLOCK 1.5: VIDEO + BADGES + QUOTE ========== */}
            <div className="relative py-12 md:py-16 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">

                    {/* Video Preview */}
                    <div className={cn(
                        "relative aspect-video rounded-xl overflow-hidden mb-12 opacity-0 transition-all duration-1000",
                        isVisible && "opacity-100"
                    )} style={{ transitionDelay: '400ms' }}>
                        <div className="absolute inset-0 bg-[#1a1410] flex items-center justify-center">
                            {/* Video Placeholder - replace src with actual video */}
                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover opacity-80"
                                poster="/images/hero.jpg"
                            >
                                {/* Add your video source here */}
                                <source src="/videos/coffee-roast.mp4" type="video/mp4" />
                            </video>
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2a1f1a] via-transparent to-[#2a1f1a]/30" />
                            {/* Play indicator (shows if video not loaded) */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 flex items-center justify-center bg-[#2a1f1a]/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                                    <svg className="w-6 h-6 text-amber-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Certifications Marquee - JS-based */}
                    <CertificationsMarquee isVisible={isVisible} />

                    {/* Founder Quote - More Poetic */}
                    <blockquote className={cn(
                        "text-center opacity-0 transition-all duration-1000",
                        isVisible && "opacity-100"
                    )} style={{ transitionDelay: '800ms' }}>
                        <div className="relative max-w-2xl mx-auto">
                            {/* Quote marks */}
                            <span className="absolute -top-4 -left-2 md:-left-6 text-6xl md:text-8xl text-amber-500/10 font-serif leading-none">"</span>
                            <span className="absolute -bottom-8 -right-2 md:-right-6 text-6xl md:text-8xl text-amber-500/10 font-serif leading-none">"</span>
                            <p className="font-serif text-xl md:text-2xl lg:text-3xl text-[#D4C4B0] italic leading-relaxed mb-8 px-4">
                                We don't chase trends. We chase altitude, terroir, and the farmers who've perfected their craft across generations.
                            </p>
                        </div>
                        <footer className="flex items-center justify-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center">
                                <span className="text-amber-400 font-serif text-lg">A</span>
                            </div>
                            <div className="text-left">
                                <cite className="not-italic text-sm font-semibold text-[#F5F0EB] tracking-wide">
                                    Akash Aibatolla
                                </cite>
                                <p className="text-[10px] uppercase tracking-[0.25em] text-[#8B7355]">
                                    Founder
                                </p>
                            </div>
                        </footer>
                    </blockquote>

                    {/* Decorative Line */}
                    <div className="mt-16 w-16 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto" />
                </div>
            </div>

            {/* ========== BLOCK 2: THE JOURNEY ========== */}
            <div className="relative py-20 md:py-28 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header with Animation */}
                    <div className={cn(
                        "text-center mb-16 md:mb-20 opacity-0 transition-all duration-1000",
                        isVisible && "opacity-100 translate-y-0"
                    )}>
                        <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4C4B0] font-semibold">
                            The Journey
                        </span>
                        <h3 className={cn(
                            "font-serif text-3xl md:text-5xl text-[#F5F0EB] mt-4 relative inline-block",
                            isVisible && "animate-title-reveal"
                        )}>
                            <span className="relative">
                                From Soil to
                                <span className="text-amber-400 animate-pulse-slow"> Soul</span>
                            </span>
                        </h3>
                    </div>

                    {/* Journey Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {JOURNEY_STEPS.map((step, idx) => (
                            <div
                                key={step.number}
                                className={cn(
                                    "group relative overflow-hidden rounded-xl bg-[#D4C4B0] border border-[#C4B4A0] transition-all duration-700",
                                    "hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] hover:scale-[1.02]",
                                    "opacity-0",
                                    isVisible && "opacity-100"
                                )}
                                style={{ transitionDelay: isVisible ? `${300 + idx * 150}ms` : '0ms' }}
                            >
                                {/* Card Image Area */}
                                <div className="relative h-64 md:h-72 overflow-hidden">
                                    <MediaPlaceholder
                                        type="image"
                                        src={step.imageSrc}
                                        alt={step.title}
                                        placeholderText={`ADD ${step.title.toUpperCase()} PHOTO`}
                                        className="transition-transform duration-700 group-hover:scale-110 object-[center_25%]"
                                    />
                                    {/* Number Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#2a1f1a]/90 backdrop-blur-sm rounded-full">
                                        <span className="font-serif text-xl text-amber-400">{step.number}</span>
                                    </div>
                                </div>

                                {/* Card Content - Warm Cream */}
                                <div className="p-6 md:p-8 bg-[#D4C4B0]">
                                    <h4 className="font-serif text-2xl md:text-3xl text-[#2a1f1a] mb-3 group-hover:text-[#8B4513] transition-colors">
                                        {step.title}
                                    </h4>
                                    <p className="font-sans text-sm md:text-base text-[#5a4535] leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========== STATS BLOCK ========== */}
            <div ref={statsRef} className="relative py-16 md:py-20 px-4 md:px-8">
                {/* Decorative Line Top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {STATS_DATA.map((stat, idx) => (
                            <div
                                key={stat.label}
                                className={cn(
                                    "text-center opacity-0 transition-all duration-700",
                                    statsVisible && "opacity-100"
                                )}
                                style={{ transitionDelay: statsVisible ? `${100 + idx * 100}ms` : '0ms' }}
                            >
                                <div className="font-serif text-4xl md:text-5xl lg:text-6xl text-amber-400 mb-2">
                                    <AnimatedCounter
                                        value={stat.value}
                                        suffix={stat.suffix}
                                        isVisible={statsVisible}
                                        duration={2500}
                                        delay={50 + idx * 150}
                                    />
                                </div>
                                <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#D4C4B0] font-bold mb-1">
                                    {stat.label}
                                </div>
                                <div className="text-[10px] text-[#8B7355] hidden md:block">
                                    {stat.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Line Bottom */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            </div>

            {/* ========== INLINE: THE DIFFERENCE ========== */}
            <div className="relative py-20 md:py-28 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className={cn(
                        "text-center mb-12 opacity-0 transition-all duration-1000",
                        isVisible && "opacity-100"
                    )}>
                        <span className="text-[10px] uppercase tracking-[0.4em] text-amber-500/70 font-semibold">
                            The Difference
                        </span>
                        <h3 className={cn(
                            "font-serif text-3xl md:text-5xl text-[#F5F0EB] mt-4",
                            isVisible && "animate-title-reveal"
                        )}>
                            Beyond <span className="text-amber-400 animate-pulse-slow">Ordinary</span>
                        </h3>
                        <p className="text-[#8B7355] mt-4 max-w-xl mx-auto text-sm md:text-base">
                            We don't just sell coffee. We deliver an experience crafted for those who refuse to settle.
                        </p>
                    </div>

                    {/* Premium Comparison Cards */}
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 max-w-4xl mx-auto">
                        {/* ORDINARY Side - Dark */}
                        <div className={cn(
                            "relative p-6 md:p-8 rounded-xl bg-[#1a1410] border border-[#3d2b1f] opacity-0 transition-all duration-1000",
                            isVisible && "opacity-100"
                        )} style={{ transitionDelay: '300ms' }}>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-400/10 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-red-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                    </div>
                                    <h4 className="text-xs uppercase tracking-[0.2em] text-[#8B7355] font-bold">
                                        Ordinary Coffee
                                    </h4>
                                </div>
                            </div>
                            <ul className="space-y-4">
                                {COMPARISON_DATA.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className={cn(
                                            "flex items-start gap-3 text-[#8B7355]/60 opacity-0 transition-all duration-500 pb-3 border-b border-[#3d2b1f]/50 last:border-0",
                                            isVisible && "opacity-100"
                                        )}
                                        style={{ transitionDelay: isVisible ? `${400 + idx * 60}ms` : '0ms' }}
                                    >
                                        <svg className="w-4 h-4 text-red-400/40 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        <span className="text-sm line-through">{item.ordinary}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-4 border-t border-[#3d2b1f]">
                                <p className="text-[10px] uppercase tracking-wider text-[#5a4535] italic">"Just another cup of coffee"</p>
                            </div>
                        </div>

                        {/* VANTA Side - Warm Cream */}
                        <div className={cn(
                            "relative p-6 md:p-8 rounded-xl bg-[#D4C4B0] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] opacity-0 transition-all duration-1000",
                            isVisible && "opacity-100"
                        )} style={{ transitionDelay: '400ms' }}>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full" />
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                                        <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="text-xs uppercase tracking-[0.2em] text-[#6B4423] font-bold">
                                        Vanta Standard
                                    </h4>
                                </div>
                                <span className="text-[8px] uppercase tracking-wider bg-amber-500/20 text-amber-700 px-2 py-1 rounded-full font-bold">Premium</span>
                            </div>
                            <ul className="space-y-4">
                                {COMPARISON_DATA.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className={cn(
                                            "flex items-start gap-3 text-[#2a1f1a] opacity-0 transition-all duration-500 pb-3 border-b border-[#C4B4A0]/50 last:border-0",
                                            isVisible && "opacity-100"
                                        )}
                                        style={{ transitionDelay: isVisible ? `${500 + idx * 60}ms` : '0ms' }}
                                    >
                                        <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm font-medium">{item.vanta}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6 pt-4 border-t border-[#C4B4A0]">
                                <p className="text-[10px] uppercase tracking-wider text-[#8B4513] font-semibold">"The ritual you deserve"</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className={cn(
                        "text-center mt-16 opacity-0 transition-all duration-1000",
                        isVisible && "opacity-100"
                    )} style={{ transitionDelay: '800ms' }}>
                        <button
                            onClick={openMenu}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-[#1a1410] font-bold text-sm uppercase tracking-[0.15em] rounded-full transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 group"
                        >
                            Explore The Collection
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                    </div>

                    {/* Promise Block */}
                    <div className={cn(
                        "flex flex-wrap justify-center gap-4 md:gap-8 mt-12 opacity-0 transition-all duration-1000",
                        isVisible && "opacity-100"
                    )} style={{ transitionDelay: '900ms' }}>
                        {[
                            { icon: '✓', text: 'Roasted to order' },
                            { icon: '✓', text: 'Free shipping $50+' },
                            { icon: '✓', text: '30-day guarantee' }
                        ].map((promise, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 text-[#8B7355] text-xs md:text-sm"
                            >
                                <span className="text-amber-500">{promise.icon}</span>
                                <span>{promise.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* No bottom gradient needed - Atmosphere has same background color */}
        </section>
    );
};
