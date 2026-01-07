import React from 'react';
import { Magnetic } from './Magnetic';

// --- MOCK DATA ---
const PRODUCTS = [
  {
    id: 1,
    name: "Obsidian Blend",
    type: "Signature Espresso",
    price: 24,
    weight: "340g",
    notes: ["Dark Chocolate", "Molasses", "Smoke"],
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop", // Placeholder bag
    isNew: false
  },
  {
    id: 2,
    name: "Gold Label: Geisha",
    type: "Single Origin / Panama",
    price: 85,
    weight: "250g",
    notes: ["Jasmine", "Bergamot", "Honey"],
    image: "https://images.unsplash.com/photo-1584286595398-a59f21d313f9?q=80&w=1000&auto=format&fit=crop",
    isNew: true
  },
  {
    id: 3,
    name: "Midnight Decaf",
    type: "Swiss Water Process",
    price: 22,
    weight: "340g",
    notes: ["Hazelnut", "Caramel", "Malt"],
    image: "https://images.unsplash.com/photo-1621256087707-169542a9697f?q=80&w=1000&auto=format&fit=crop",
    isNew: false
  },
  {
    id: 4,
    name: "Eclipse Roast",
    type: "Filter Blend",
    price: 26,
    weight: "340g",
    notes: ["Black Berry", "Vanilla", "Oak"],
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1000&auto=format&fit=crop",
    isNew: false
  }
];

export const TheCollection: React.FC = () => {
  return (
    <section className="relative w-full py-32 bg-[#12100E] overflow-hidden">
      
      {/* Decorative Background Text */}
      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
        <span className="text-[20vw] font-serif font-black text-white leading-none whitespace-nowrap animate-marquee">
          THE COLLECTION — SMALL BATCH — RARE FINDS — 
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group relative">
              <div className="aspect-[3/4] overflow-hidden bg-[#1A1816] relative mb-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-[#C4873A] text-[#12100E] text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    New Arrival
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <div className="space-y-2">
                <p className="text-[#8B7355] text-xs tracking-[0.2em] uppercase">{product.type}</p>
                <h3 className="text-white font-serif text-2xl group-hover:text-[#C4873A] transition-colors duration-300">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 text-[#666] text-xs tracking-wider uppercase">
                  {product.notes.join(" • ")}
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-white font-mono opacity-60">${product.price}.00</span>
                  <Magnetic>
                    <button className="text-[#C4873A] text-xs uppercase tracking-widest hover:text-white transition-colors">
                      Add to Cart
                    </button>
                  </Magnetic>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
