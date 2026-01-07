import React, { useRef, useState } from 'react';
import { cn } from '../lib/utils';
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

      <div className="relative z-10 max-w-7xl mx-auto