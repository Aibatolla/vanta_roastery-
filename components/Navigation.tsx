import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useMenu } from '../context/MenuContext';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
    { id: 'hero', label: 'Home' },
    { id: 'standard', label: 'Quality' },
    { id: 'ritual', label: 'The Ritual' },
    { id: 'atmosphere', label: 'Experience' },
    { id: 'origins', label: 'Origins' },
    { id: 'limited', label: 'Limited' },
    { id: 'subscription', label: 'Subscribe' },
];

interface NavigationProps {
    onReserveClick?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onReserveClick }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showLogo, setShowLogo] = useState(false);
    const { open: openMenu } = useMenu();
    const { openCart, itemCount } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Show logo only after hero section
            const heroSection = document.getElementById('hero');
            if (heroSection) {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                setShowLogo(window.scrollY > heroBottom - 100);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Desktop & Mobile Header */}
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
                    scrolled
                        ? "bg-black/40 backdrop-blur-2xl border-b border-amber-400/10"
                        : "bg-transparent"
                )}
            >
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    {/* Logo area */}
                    <div className="flex items-center gap-3">
                        {/* V Avatar - shows in hero, fades when scrolled */}
                        <div className={cn(
                            "w-10 h-10 rounded-full border-2 border-amber-500/40 bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.2)] transition-all duration-500",
                            showLogo ? "opacity-0 scale-75 w-0 overflow-hidden" : "opacity-100 scale-100"
                        )}>
                            <span className="font-serif text-lg text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">V</span>
                        </div>

                        {/* VANTA text - appears after hero */}
                        <div className={cn(
                            "transition-all duration-700",
                            showLogo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                        )}>
                            <button
                                onClick={() => scrollToSection('hero')}
                                className="group relative"
                            >
                                <span className="font-serif text-xl text-white tracking-[0.2em] group-hover:tracking-[0.25em] transition-all duration-300">
                                    VANTA
                                </span>
                                <div className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-amber-500 to-amber-300 group-hover:w-full transition-all duration-500" />
                            </button>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {NAV_LINKS.map((link, idx) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className="group relative px-4 py-2 text-neutral-400 hover:text-white text-[10px] uppercase tracking-[0.15em] transition-all duration-300"
                                style={{ transitionDelay: `${idx * 30}ms` }}
                            >
                                <span className="relative z-10">{link.label}</span>
                                {/* Underline indicator */}
                                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent group-hover:w-full transition-all duration-500" />
                                {/* Glow effect on hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                            </button>
                        ))}
                        {/* Reserve Button */}
                        {onReserveClick && (
                            <button
                                onClick={onReserveClick}
                                className="ml-1 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 text-[10px] uppercase tracking-[0.15em] transition-all duration-300"
                            >
                                Reserve
                            </button>
                        )}
                        {/* Menu Button */}
                        <button
                            onClick={openMenu}
                            className="ml-1 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 text-[10px] uppercase tracking-[0.15em] transition-all duration-300"
                        >
                            Menu
                        </button>
                        {/* Cart Button */}
                        <button
                            onClick={openCart}
                            className="relative ml-2 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-500/30 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Mobile Burger - refined */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md hover:border-amber-400/30 transition-all group"
                        aria-label="Menu"
                    >
                        <span className={cn(
                            "w-4 h-px bg-gradient-to-r from-white to-amber-400 transition-all duration-300",
                            mobileMenuOpen && "rotate-45 translate-y-1.5"
                        )} />
                        <span className={cn(
                            "w-4 h-px bg-gradient-to-r from-white to-amber-400 transition-all duration-300",
                            mobileMenuOpen && "opacity-0 scale-0"
                        )} />
                        <span className={cn(
                            "w-4 h-px bg-gradient-to-r from-white to-amber-400 transition-all duration-300",
                            mobileMenuOpen && "-rotate-45 -translate-y-1.5"
                        )} />
                    </button>
                </div>

                {/* Bottom gradient line when scrolled */}
                {scrolled && (
                    <div className="absolute bottom-0 left-0 right-0 h-px">
                        <div className="h-full bg-gradient-to-r from-transparent via-amber-400/20 to-transparent animate-pulse" />
                    </div>
                )}
            </nav>

            {/* Mobile Slide-in Menu - ultra premium */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-screen w-80 z-40 transition-all duration-500 md:hidden",
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0908] via-[#111] to-[#0a0908]" />

                {/* Animated mesh gradient overlay */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute w-96 h-96 -top-20 -left-20 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
                    <div className="absolute w-72 h-72 bottom-20 -right-20 bg-gradient-to-tl from-amber-600/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Animated glow border on left */}
                <div className="absolute inset-y-0 left-0 w-[2px] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-amber-500/80 to-amber-500/0"
                        style={{ animation: 'glowMove 3s ease-in-out infinite' }} />
                </div>

                {/* CSS animations */}
                <style>{`
                    @keyframes glowMove {
                        0%, 100% { transform: translateY(-50%); }
                        50% { transform: translateY(50%); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes shimmer {
                        0% { background-position: -200% center; }
                        100% { background-position: 200% center; }
                    }
                `}</style>

                {/* Content */}
                <div className="relative h-full flex flex-col p-5 pt-16">
                    {/* Logo with glow */}
                    <div className="mb-4 pb-3 border-b border-amber-500/10">
                        <div className="relative inline-block">
                            <h2 className="font-serif text-3xl text-white tracking-[0.2em] mb-1 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                                VANTA
                            </h2>
                            <div className="absolute -inset-3 bg-amber-500/5 blur-xl rounded-full" />
                        </div>
                        <p className="text-amber-400 text-[10px] tracking-[0.3em] uppercase font-medium">Roastery</p>
                    </div>

                    {/* Navigation links - premium style */}
                    <nav className="flex-1 space-y-1 overflow-y-auto pb-4">
                        {NAV_LINKS.map((link, idx) => (
                            <button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                className="group w-full text-left relative overflow-hidden rounded-lg"
                                style={{
                                    animationDelay: `${idx * 50}ms`,
                                    animation: mobileMenuOpen ? 'slideInRight 0.4s ease-out forwards' : 'none',
                                    opacity: mobileMenuOpen ? 1 : 0
                                }}
                            >
                                <div className="relative z-10 py-2 px-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/40 group-hover:bg-amber-500 group-hover:shadow-[0_0_10px_rgba(251,191,36,0.8)] transition-all duration-300" />
                                        <span className="text-neutral-400 group-hover:text-white text-sm uppercase tracking-[0.15em] transition-all duration-300 group-hover:tracking-[0.2em]">
                                            {link.label}
                                        </span>
                                    </div>
                                    <svg
                                        className="w-4 h-4 text-amber-400/0 group-hover:text-amber-400 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                                {/* Hover gradient background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 rounded-lg" />
                            </button>
                        ))}

                        {/* Divider */}
                        <div className="py-2">
                            <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
                        </div>

                        {/* View Menu Button - Premium gold style */}
                        <button
                            onClick={() => { setMobileMenuOpen(false); openMenu(); }}
                            className="group relative w-full py-3 rounded-xl overflow-hidden transition-all duration-300"
                        >
                            {/* Animated gradient border */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 p-[1px]"
                                style={{ backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }}>
                                <div className="w-full h-full bg-[#0f0d0a] rounded-xl" />
                            </div>
                            <div className="absolute inset-[1px] rounded-xl bg-gradient-to-b from-amber-500/20 to-transparent" />
                            <span className="relative z-10 font-semibold text-amber-400 group-hover:text-amber-300 text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                The Menu
                            </span>
                        </button>

                        {/* Reserve Table Button */}
                        {onReserveClick && (
                            <button
                                onClick={() => { setMobileMenuOpen(false); onReserveClick(); }}
                                className="group relative w-full mt-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5 text-neutral-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-neutral-300 group-hover:text-white text-sm uppercase tracking-[0.15em] transition-colors">
                                    Reserve Table
                                </span>
                            </button>
                        )}

                        {/* Cart Button */}
                        <button
                            onClick={() => { setMobileMenuOpen(false); openCart(); }}
                            className="group relative w-full mt-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <div className="relative">
                                <svg className="w-5 h-5 text-neutral-400 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                                        {itemCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-neutral-300 group-hover:text-white text-sm uppercase tracking-[0.15em] transition-colors">
                                Cart
                            </span>
                        </button>
                    </nav>

                    {/* Bottom info - premium */}
                    <div className="pt-6 border-t border-white/5 space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <p className="text-neutral-500 text-xs uppercase tracking-widest">Open Now</p>
                        </div>
                        <p className="text-amber-400/50 text-xs tracking-wide">Downtown Los Angeles</p>
                    </div>
                </div>

                {/* Floating particle accents */}
                <div className="absolute top-20 right-8 w-1 h-1 rounded-full bg-amber-500/60 animate-pulse" style={{ animation: 'float 4s ease-in-out infinite' }} />
                <div className="absolute top-40 right-16 w-0.5 h-0.5 rounded-full bg-amber-400/40 animate-pulse" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }} />
                <div className="absolute bottom-40 right-10 w-1 h-1 rounded-full bg-amber-500/30 animate-pulse" style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '0.5s' }} />
            </div>

            {/* Mobile Overlay - enhanced */}
            {mobileMenuOpen && (
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                />
            )}

            <style>{`
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    );
};
