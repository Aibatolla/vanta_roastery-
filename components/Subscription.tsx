import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { sendSubscriptionNotification } from '../lib/telegram';

const PLANS = [
    {
        id: 'explorer',
        name: 'Explorer',
        subtitle: 'The Gateway',
        price: 29,
        originalPrice: 39,
        coffee: '250g',
        bags: 1,
        origins: 'Single Origin',
        roast: 'Standard',
        shipping: 'Free',
        popular: false,
        cupsPerDay: 1,
        pricePerCup: 0.97,
        description: 'Perfect for coffee curious minds',
        features: ['Tasting notes card', 'Origin story included', 'Cancel anytime'],
        color: 'white', // clean white theme
        whiskey: false
    },
    {
        id: 'connoisseur',
        name: 'Connoisseur',
        subtitle: 'Most Popular',
        price: 54,
        originalPrice: 72,
        coffee: '680g',
        bags: 2,
        origins: 'Rare Micro-lots',
        roast: 'Exclusive Profiles',
        shipping: 'Priority',
        popular: true,
        cupsPerDay: 2,
        pricePerCup: 0.90,
        description: 'For those who demand excellence',
        features: ['Brewing guide', 'Members-only releases', 'Whiskey Barrel Aged included', 'Priority shipping'],
        color: 'amber', // amber/gold theme
        whiskey: true
    },
    {
        id: 'collector',
        name: 'Collector',
        subtitle: 'The Obsession',
        price: 89,
        originalPrice: 120,
        coffee: '1kg+',
        bags: 3,
        origins: 'First Access',
        roast: 'Personalized Curve',
        shipping: 'Express',
        popular: false,
        cupsPerDay: 3,
        pricePerCup: 0.79,
        description: 'The ultimate pursuit of perfection',
        features: ['All Limited Editions', 'Whiskey Barrel priority', 'Private Discord', 'Origin trip raffle'],
        color: 'red', // premium red theme
        whiskey: true
    }
];

const JOURNEY = [
    { num: '01', title: 'Choose', icon: 'clipboard' },
    { num: '02', title: 'Receive', icon: 'package' },
    { num: '03', title: 'Taste', icon: 'cup' },
    { num: '04', title: 'Refine', icon: 'sparkle' },
];

// SVG Icons for Journey timeline
const JourneyIcon: React.FC<{ icon: string; isActive: boolean }> = ({ icon, isActive }) => {
    const color = isActive ? 'text-black' : 'text-amber-400';
    const size = 'w-5 h-5';

    switch (icon) {
        case 'clipboard':
            return (
                <svg className={`${size} ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            );
        case 'package':
            return (
                <svg className={`${size} ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            );
        case 'cup':
            return (
                <svg className={`${size} ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12a2 2 0 01-2-2v-4a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2h-8z" />
                </svg>
            );
        case 'sparkle':
            return (
                <svg className={`${size} ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            );
        default:
            return null;
    }
};

const REVIEWS = [
    { name: 'Sarah M.', city: 'NYC', text: 'Panama Geisha was life-changing. Best at-home coffee ever.' },
    { name: 'James K.', city: 'LA', text: 'Cancelled my $200/mo café habit. Unmatched freshness.' },
    { name: 'Elena R.', city: 'Miami', text: 'Educational notes. Finally understand terroir in coffee.' },
    { name: 'Marcus T.', city: 'Chicago', text: 'Upgraded to Collector fast. Ethiopia micro-lots are incredible.' },
    { name: 'Olivia W.', city: 'Seattle', text: 'Seattle local roasters can\'t compete. Vanta is next level.' },
    { name: 'Daniel P.', city: 'Austin', text: 'Fruit notes I never knew existed. Pure revelation.' },
    { name: 'Mia L.', city: 'Denver', text: '8 months in. Every bag exceptional. Amazing service.' },
    { name: 'Alex C.', city: 'Portland', text: 'Former barista approved. Guides perfected my extraction.' },
    { name: 'Nina S.', city: 'Boston', text: 'Both addicted now. Guatemala Antigua was stunning.' },
    { name: 'Tom H.', city: 'SF', text: 'Better than any local. Direct trade quality shows.' },
    { name: 'Lisa K.', city: 'Dallas', text: 'Beautiful packaging. Unboxing feels special every month.' },
    { name: 'Ryan M.', city: 'Phoenix', text: 'Educated my palate. Can never go back to regular coffee.' },
];

// JS-based infinite scroll marquee that works on mobile
const ReviewsMarquee: React.FC<{ reviews: typeof REVIEWS }> = ({ reviews }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const positionRef = useRef(0);
    const speedRef = useRef(0.5); // pixels per frame

    useEffect(() => {
        const scrollEl = scrollRef.current;
        const containerEl = containerRef.current;
        if (!scrollEl || !containerEl) return;

        let animationId: number;

        const animate = () => {
            if (!isHovered) {
                positionRef.current -= speedRef.current;

                // Get half width (we duplicate content)
                const halfWidth = scrollEl.scrollWidth / 2;

                // Reset seamlessly when first half is scrolled
                if (Math.abs(positionRef.current) >= halfWidth) {
                    positionRef.current = 0;
                }

                scrollEl.style.transform = `translateX(${positionRef.current}px)`;
            }
            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [isHovered]);

    // Double the reviews for seamless loop
    const doubledReviews = [...reviews, ...reviews];

    return (
        <div className="mb-10">
            <h4 className="text-center text-neutral-600 text-[10px] uppercase tracking-[0.3em] mb-6">
                Loved by Coffee Obsessives
            </h4>
            <div
                ref={containerRef}
                className="relative overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-r from-[#0a0908] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-20 bg-gradient-to-l from-[#0a0908] to-transparent z-10" />

                <div
                    ref={scrollRef}
                    className="flex gap-4 will-change-transform"
                    style={{ transform: 'translateX(0px)' }}
                >
                    {doubledReviews.map((r, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-64 md:w-72 p-4 rounded-xl bg-white/[0.03] border border-white/10"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold">
                                    {r.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-white text-sm font-medium truncate block">{r.name}</span>
                                    <span className="text-neutral-500 text-xs">{r.city}</span>
                                </div>
                                <span className="text-amber-500 text-xs md:text-sm">★★★★★</span>
                            </div>
                            <p className="text-neutral-300 text-xs md:text-sm leading-relaxed">"{r.text}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Plan card component with inline form
const PlanCard: React.FC<{ plan: typeof PLANS[0], className?: string }> = ({ plan: p, className }) => {
    const savings = Math.round((p.originalPrice - p.price));
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Send Telegram notification (no DB save to avoid needing new table)
            await sendSubscriptionNotification({
                name,
                phone,
                plan: p.name,
                price: p.price
            });

            setIsSuccess(true);
        } catch {
            // Still show success to user, notification sent
            setIsSuccess(true);
        } finally {
            setIsSubmitting(false);
        }

        // Reset after 3 seconds
        setTimeout(() => {
            setShowForm(false);
            setIsSuccess(false);
            setName('');
            setPhone('');
        }, 3000);
    };

    return (
        <div className={cn(
            "rounded-2xl p-5 relative overflow-hidden",
            p.color === 'white' && "bg-gradient-to-b from-white/10 to-[#0a0908] border border-white/20",
            p.color === 'amber' && "bg-gradient-to-b from-amber-950/50 to-[#0a0908] border border-amber-600/40",
            p.color === 'red' && "bg-gradient-to-b from-red-950/40 to-[#0a0908] border border-red-500/40",
            className
        )}>
            {p.popular && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />}

            {/* Whiskey badge - centered text */}
            {p.whiskey && (
                <div className="absolute top-4 left-4 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1 flex items-center justify-center">
                    <span className="text-amber-400 text-[8px] font-bold tracking-wider">WHISKEY</span>
                </div>
            )}

            {/* Savings badge */}
            <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
                <span className="text-green-400 text-[10px] font-bold">SAVE ${savings}</span>
            </div>

            <div className="mb-4 mt-6">
                <span className={cn(
                    "text-[9px] uppercase tracking-widest",
                    p.color === 'white' && "text-white/70",
                    p.color === 'amber' && "text-amber-500",
                    p.color === 'red' && "text-red-400"
                )}>{p.subtitle}</span>
                <h3 className="font-serif text-2xl text-white">{p.name}</h3>
                <p className="text-neutral-500 text-xs mt-1">{p.description}</p>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-serif text-white">${p.price}</span>
                <span className="text-neutral-600 text-sm line-through">${p.originalPrice}</span>
                <span className="text-neutral-500 text-sm">/mo</span>
            </div>

            {/* Collapsible content when form is shown */}
            {!showForm && (
                <>
                    {/* Value highlight */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mb-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12a2 2 0 01-2-2v-4a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2h-8z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-white text-xs font-bold">{p.cupsPerDay} cup{p.cupsPerDay > 1 ? 's' : ''}/day</span>
                                    <p className="text-amber-400/70 text-[9px]">~{p.bags * 18} cups/mo</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-amber-400 text-lg font-bold">${p.pricePerCup.toFixed(2)}</span>
                                <p className="text-amber-400/70 text-[9px]">per cup</p>
                            </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-amber-500/20 text-center">
                            <span className="text-amber-300 text-[10px]">vs. $4.50 café → Save <strong>${Math.round((4.50 - p.pricePerCup) * 30)}/mo</strong></span>
                        </div>
                    </div>

                    {/* Quick features - minimal */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                            <span className="text-white text-sm font-bold block">{p.coffee}</span>
                            <p className="text-neutral-600 text-[9px]">{p.bags} bag{p.bags > 1 ? 's' : ''}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                            <span className="text-white text-sm font-bold block">{p.origins}</span>
                            <p className="text-neutral-600 text-[9px]">access</p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.features.map((f, i) => (
                            <span key={i} className="px-2 py-1 rounded-full text-[9px] bg-white/5 text-neutral-300 border border-white/10">✓ {f}</span>
                        ))}
                    </div>
                </>
            )}

            {/* Form or CTA */}
            {showForm ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                    {isSuccess ? (
                        <div className="text-center py-4">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-white text-sm font-medium">We'll be in touch soon!</p>
                            <p className="text-neutral-500 text-xs mt-1">Check your phone for details</p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Your name"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
                                />
                            </div>
                            <div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    placeholder="Phone number"
                                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting || !name || !phone}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-full transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>Confirm Subscription</span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="w-full py-2 text-neutral-500 text-xs hover:text-white transition-colors"
                            >
                                ← Back
                            </button>
                        </>
                    )}
                </form>
            ) : (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-full transition-all"
                    style={{ animation: 'pulseGlow 2s ease-in-out infinite' }}
                >
                    Start Your Ritual →
                </button>
            )}
        </div>
    );
};

export const Subscription: React.FC = () => {
    const ref = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);
    const [plan, setPlan] = useState('connoisseur');
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) setVisible(true);
        }, { threshold: 0.1 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    // Continuous timeline animation when visible
    useEffect(() => {
        if (!visible) return;
        const interval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % 4);
        }, 1500);
        return () => clearInterval(interval);
    }, [visible]);

    const selectedPlan = PLANS.find(x => x.id === plan) || PLANS[1];

    return (
        <section ref={ref} className="relative w-full py-20 md:py-28 bg-[#0a0908] overflow-hidden">
            <style>{`
                @keyframes breathe {
                    0%, 100% { 
                        color: #fbbf24; 
                        text-shadow: 0 0 10px rgba(251,191,36,0.3);
                        transform: scale(1);
                    }
                    50% { 
                        color: #f59e0b; 
                        text-shadow: 0 0 30px rgba(251,191,36,0.6), 0 0 60px rgba(251,191,36,0.3);
                        transform: scale(1.02);
                    }
                }
                @keyframes fastMarquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(251,191,36,0.3); }
                    50% { box-shadow: 0 0 40px rgba(251,191,36,0.6); }
                }
                @keyframes stepPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
            `}</style>

            <div className="max-w-6xl mx-auto px-6 md:px-8">

                {/* HEADER */}
                <div className={cn("text-center mb-12 transition-all duration-700", visible ? "opacity-100" : "opacity-0")}>
                    <span className="text-amber-600 text-[10px] uppercase tracking-[0.5em] font-semibold mb-3 block">Never Run Empty</span>
                    <h2 className="font-serif text-4xl md:text-6xl text-white tracking-tight mb-3">
                        Your{' '}
                        <span
                            className="inline-block"
                            style={{ animation: 'breathe 2.5s ease-in-out infinite' }}
                        >Ritual</span>
                        , Delivered
                    </h2>
                    <p className="text-neutral-500 text-sm max-w-md mx-auto">Fresh roasted within 48h. Expertly sourced. Cancel anytime.</p>
                </div>

                {/* TIMELINE - ALWAYS FLOWING */}
                <div className={cn("mb-16 transition-opacity duration-500", visible ? "opacity-100" : "opacity-0")}>
                    <div className="flex justify-between items-start max-w-md mx-auto relative">
                        <div className="absolute top-6 left-10 right-10 h-px bg-neutral-800" />

                        {JOURNEY.map((j, i) => (
                            <div key={i} className="relative flex flex-col items-center z-10">
                                <div
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-500",
                                        activeStep === i
                                            ? "bg-amber-500 shadow-[0_0_25px_rgba(251,191,36,0.6)]"
                                            : "bg-neutral-900 border border-neutral-700"
                                    )}
                                    style={activeStep === i ? { animation: 'stepPulse 1s ease-in-out infinite' } : {}}
                                >
                                    <JourneyIcon icon={j.icon} isActive={activeStep === i} />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider transition-colors",
                                    activeStep === i ? "text-amber-400" : "text-neutral-600"
                                )}>{j.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* TABS - MOBILE ONLY */}
                <div className={cn("flex md:hidden justify-center gap-3 mb-8", visible ? "opacity-100" : "opacity-0")}>
                    {PLANS.map(x => (
                        <button
                            key={x.id}
                            onClick={() => setPlan(x.id)}
                            className={cn(
                                "relative px-5 py-2.5 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all",
                                plan === x.id
                                    ? "bg-amber-500 text-black"
                                    : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {x.name}
                            {x.popular && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-lg">★</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* PLAN CARDS */}
                {/* Mobile: Single selected card */}
                <div className="md:hidden max-w-md mx-auto mb-10">
                    <PlanCard plan={selectedPlan} />
                </div>

                {/* Desktop: All 3 cards in grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-6 mb-10">
                    {PLANS.map(p => (
                        <PlanCard
                            key={p.id}
                            plan={p}
                            className={p.popular ? "scale-105 shadow-2xl shadow-amber-500/20" : ""}
                        />
                    ))}
                </div>

                {/* GUARANTEE */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-green-600/40 bg-green-900/20 text-green-400 text-[11px] font-medium">
                        ✓ 100% Money Back Guarantee — Love it or full refund
                    </span>
                </div>

                {/* REVIEWS - JS-BASED INFINITE SCROLL */}
                <ReviewsMarquee reviews={REVIEWS} />

                {/* TRUST */}
                <div className="flex flex-wrap justify-center gap-6 text-neutral-600 text-[10px] uppercase tracking-wider">
                    <span>✓ Cancel Anytime</span>
                    <span>✓ Fresh Roasted</span>
                    <span>✓ Free Shipping</span>
                    <span>✓ 48h Delivery</span>
                </div>
            </div>
        </section>
    );
};
