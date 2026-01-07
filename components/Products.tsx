import React, { useRef, useEffect, useState } from 'react';
import { cn } from '../lib/utils';

const PRODUCTS = [
    {
        id: 1,
        name: "Eclipse Blend",
        origin: "Ethiopia / Colombia",
        roast: "Medium-Dark",
        price: 24,
        weight: "340g",
        notes: ["Dark Chocolate", "Cherry", "Caramel"],
        image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop",
        badge: "Best Seller",
        badgeColor: "bg-amber-500"
    },
    {
        id: 2,
        name: "Sunrise Reserve",
        origin: "Kenya, Nyeri",
        roast: "Light",
        price: 28,
        weight: "250g",
        notes: ["Blood Orange", "Jasmine", "Honey"],
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop",
        badge: "Limited",
        badgeColor: "bg-rose-500"
    },
    {
        id: 3,
        name: "Obsidian",
        origin: "Sumatra, Indonesia",
        roast: "Dark",
        price: 22,
        weight: "340g",
        notes: ["Tobacco", "Dark Cocoa", "Earth"],
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop",
        badge: null,
        badgeColor: null
    },
    {
        id: 4,
        name: "Morning Bloom",
        origin: "Guatemala, Huehue",
        roast: "Medium",
        price: 26,
        weight: "340g",
        notes: ["Brown Sugar", "Almond", "Citrus"],
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&auto=format&fit=crop",
        badge: "New",
        badgeColor: "bg-emerald-500"
    },
    {
        id: 5,
        name: "Velvet Night",
        origin: "Brazil, Cerrado",
        roast: "Medium-Dark",
        price: 20,
        weight: "340g",
        notes: ["Hazelnut", "Milk Chocolate", "Toffee"],
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop",
        badge: null,
        badgeColor: null
    },
    {
        id: 6,
        name: "Aurora",
        origin: "Costa Rica, Tarrazu",
        roast: "Light",
        price: 32,
        weight: "200g",
        notes: ["Peach", "Bergamot", "Vanilla"],
        image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop",
        badge: "Rare",
        badgeColor: "bg-violet-500"
    }
];

export const Products: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

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

    return (
        <section
            ref={sectionRef}
            className="relative w-full py-24 md:py-32 bg-[#0d0c0a] overflow-hidden"
            aria-label="Products Section"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />
                <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[#1a1512] to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#080706] to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                {/* Header */}
                <div className={cn(
                    "flex flex-col items-center text-center mb-16 md:mb-20 transition-all duration-[1200ms] ease-out",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                )}>
                    <span className="text-neutral-500 font-sans text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-semibold mb-4">
                        The Collection
                    </span>

                    <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white tracking-tight mb-6">
                        SHOP <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">RELEASES</span>
                    </h2>

                    <p className="font-sans font-light max-w-xl text-sm md:text-lg text-neutral-400 leading-relaxed">
                        Each batch is roasted to order. Ships within 24 hours of roasting.
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {PRODUCTS.map((product, idx) => (
                        <div
                            key={product.id}
                            className={cn(
                                "group relative bg-[#151311] rounded-lg overflow-hidden transition-all duration-700 ease-out cursor-pointer",
                                "border border-white/5 hover:border-amber-500/30",
                                "hover:shadow-[0_20px_60px_-15px_rgba(196,122,58,0.3)]",
                                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                            )}
                            style={{ transitionDelay: isVisible ? `${idx * 100}ms` : '0ms' }}
                            onMouseEnter={() => setHoveredId(product.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Badge */}
                            {product.badge && (
                                <div className={cn(
                                    "absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold text-white",
                                    product.badgeColor,
                                    "shadow-lg"
                                )}>
                                    {product.badge}
                                </div>
                            )}

                            {/* Image Container */}
                            <div className="relative h-64 md:h-72 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#151311] via-transparent to-transparent opacity-80" />

                                {/* Hover Overlay */}
                                <div className={cn(
                                    "absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-500",
                                    hoveredId === product.id ? "opacity-100" : "opacity-0"
                                )}>
                                    <button className="px-6 py-3 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest rounded-full transform transition-all duration-300 hover:bg-amber-400 hover:scale-105 shadow-2xl">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="relative p-6">
                                {/* Origin & Roast */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold">
                                        {product.origin}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-neutral-600" />
                                    <span className="text-[9px] uppercase tracking-widest text-neutral-500">
                                        {product.roast}
                                    </span>
                                </div>

                                {/* Name & Price */}
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="font-serif text-xl md:text-2xl text-white group-hover:text-amber-100 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="text-right">
                                        <span className="font-serif text-2xl text-white">${product.price}</span>
                                        <span className="block text-[10px] text-neutral-500 mt-0.5">{product.weight}</span>
                                    </div>
                                </div>

                                {/* Tasting Notes */}
                                <div className="flex flex-wrap gap-2">
                                    {product.notes.map((note) => (
                                        <span
                                            key={note}
                                            className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-neutral-400 uppercase tracking-wider transition-colors group-hover:border-amber-500/30 group-hover:text-amber-200/80"
                                        >
                                            {note}
                                        </span>
                                    ))}
                                </div>

                                {/* Bottom Line */}
                                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-widest text-neutral-600">
                                        Free shipping over $50
                                    </span>
                                    <div className="flex items-center gap-1 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-[10px] uppercase tracking-widest font-bold">View</span>
                                        <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Shine Effect */}
                            <div className={cn(
                                "absolute inset-0 pointer-events-none transition-opacity duration-500",
                                hoveredId === product.id ? "opacity-100" : "opacity-0"
                            )}>
                                <div className="absolute inset-[-100%] w-[300%] h-[300%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 animate-[shine_2s_ease-in-out_infinite]" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className={cn(
                    "flex flex-col items-center mt-16 md:mt-20 transition-all duration-1000 delay-500",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}>
                    <button className="group relative px-10 py-4 bg-transparent border border-white/20 rounded-full text-white text-xs uppercase tracking-[0.25em] font-bold overflow-hidden transition-all duration-500 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(196,122,58,0.2)]">
                        <span className="relative z-10 group-hover:text-amber-100 transition-colors">View All Products</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/0 via-amber-900/30 to-amber-900/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </button>
                    <span className="mt-4 text-[10px] uppercase tracking-widest text-neutral-600">
                        12 Single Origins • 6 Blends
                    </span>
                </div>
            </div>

            {/* Keyframes */}
            <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }
      `}</style>
        </section>
    );
};
