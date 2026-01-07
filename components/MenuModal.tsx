import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import type { CartItem } from '../lib/supabase';
import { Cursor } from './Cursor';

// ============================================
// MENU DATA
// ============================================

const COFFEE_MENU = [
    { name: 'Ethiopian Yirgacheffe', desc: 'Floral, bergamot, honey sweetness', priceM: 6.50, priceL: 8.00 },
    { name: 'Panama Geisha', desc: 'Jasmine, tropical fruit, silky body', priceM: 12.00, priceL: 15.00 },
    { name: 'Kenya AA Nyeri', desc: 'Blackcurrant, tomato acidity, wine-like', priceM: 7.00, priceL: 8.50 },
    { name: 'Colombia Huila', desc: 'Caramel, red apple, balanced', priceM: 5.50, priceL: 7.00 },
    { name: 'Guatemala Antigua', desc: 'Chocolate, spice, smoky finish', priceM: 6.00, priceL: 7.50 },
    { name: 'Costa Rica Tarrazú', desc: 'Bright citrus, brown sugar, clean', priceM: 6.50, priceL: 8.00 },
    { name: 'Sumatra Mandheling', desc: 'Earthy, cedar, dark chocolate', priceM: 5.50, priceL: 7.00 },
    { name: 'Yemen Mocha', desc: 'Dried fruit, wine, complex spice', priceM: 14.00, priceL: 17.00 },
    { name: 'Jamaica Blue Mountain', desc: 'Mild, sweet, no bitterness', priceM: 18.00, priceL: 22.00 },
    { name: 'Whiskey Barrel Aged', desc: 'Oak, vanilla, bourbon essence', priceM: 9.00, priceL: 11.00, special: true },
    { name: 'Nitro Cold Brew', desc: 'Creamy, smooth, cascading pour', priceM: 6.00, priceL: 7.50 },
    { name: 'Oat Milk Latte', desc: 'Velvety, naturally sweet, eco', priceM: 5.50, priceL: 7.00 },
];

const TEA_MENU = [
    { name: 'Kyoto Matcha', desc: 'Ceremonial grade, umami, vibrant', priceM: 7.00, priceL: 9.00, badge: 'Imported' },
    { name: 'Darjeeling First Flush', desc: 'Muscatel, floral, champagne of teas', priceM: 6.00, priceL: 7.50, badge: 'Rare Find' },
    { name: 'Taiwanese Oolong', desc: 'Orchid, creamy, roasted notes', priceM: 6.50, priceL: 8.00 },
    { name: 'Earl Grey Supreme', desc: 'Bergamot, lavender, refined', priceM: 5.00, priceL: 6.50 },
    { name: 'Moroccan Mint', desc: 'Fresh spearmint, gunpowder green', priceM: 5.00, priceL: 6.50 },
    { name: 'Chai Masala', desc: 'Cardamom, cinnamon, ginger, bold', priceM: 5.50, priceL: 7.00, badge: 'House Blend' },
];

const ALCOHOL_MENU = [
    { name: 'Whiskey Barrel Espresso Martini', desc: 'Our aged coffee, vodka, Kahlúa', priceM: 16.00, special: true },
    { name: 'Irish Coffee', desc: 'Jameson, brown sugar, fresh cream', priceM: 14.00 },
    { name: 'Bourbon Cold Brew', desc: 'Maker\'s Mark, vanilla, nitro', priceM: 15.00 },
    { name: 'Amaretto Latte', desc: 'Disaronno, espresso, steamed milk', priceM: 13.00 },
    { name: 'Coffee Old Fashioned', desc: 'Rye whiskey, coffee bitters, orange', priceM: 15.00 },
    { name: 'Kahlúa Affogato', desc: 'Vanilla gelato, espresso, Kahlúa', priceM: 12.00 },
];

const PASTRY_MENU = [
    { name: 'Pain au Chocolat', desc: 'Flaky, Valrhona dark chocolate', price: 5.50, badge: 'Best Seller' },
    { name: 'Almond Croissant', desc: 'Twice-baked, frangipane, toasted', price: 6.00 },
    { name: 'Pistachio Financier', desc: 'Browned butter, Sicilian pistachio', price: 5.00, badge: "Chef's Pick" },
    { name: 'Cardamom Knot', desc: 'Swedish-style, aromatic, glazed', price: 5.50 },
    { name: 'Canelé Bordelais', desc: 'Caramelized crust, rum custard', price: 4.50, badge: 'Made Daily' },
];

const BREAKFAST_MENU = [
    { name: 'Avocado Toast', desc: 'Sourdough, poached egg, dukkah', price: 14.00, badge: 'Most Popular' },
    { name: 'Shakshuka', desc: 'Spiced tomato, feta, herbs, bread', price: 15.00 },
    { name: 'Granola Bowl', desc: 'House granola, Greek yogurt, berries', price: 12.00, badge: 'Healthy' },
    { name: 'Eggs Benedict', desc: 'Smoked salmon, hollandaise, chives', price: 18.00, badge: 'Premium' },
    { name: 'French Toast', desc: 'Brioche, maple, mascarpone, berries', price: 14.00 },
];

// ============================================
// MENU MODAL COMPONENT
// ============================================

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Category = 'coffee' | 'tea' | 'spirits' | 'pastry' | 'breakfast';

export const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose }) => {
    const [activeCategory, setActiveCategory] = useState<Category>('coffee');
    const { addItem, openCart } = useCart();
    const [addedItem, setAddedItem] = useState<string | null>(null);

    // Helper to add item and show feedback
    const handleAddItem = (item: Omit<CartItem, 'quantity'>) => {
        addItem(item);
        setAddedItem(item.id);
        setTimeout(() => setAddedItem(null), 1000);
    };

    // NOTE: Removed body overflow manipulation - it was causing mobile scrolling issues
    // Modal now relies on its own overlay click to close

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const categories: { id: Category; label: string }[] = [
        { id: 'coffee', label: 'Coffee' },
        { id: 'tea', label: 'Tea' },
        { id: 'spirits', label: 'Spirits' },
        { id: 'pastry', label: 'Pastry' },
        { id: 'breakfast', label: 'Breakfast' },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-0 cursor-none">
            <Cursor />
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 md:backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal - CREAM/COFFEE BACKGROUND */}
            <div className="relative z-10 w-full max-w-5xl max-h-[85vh] md:max-h-[90vh] md:mx-4 bg-gradient-to-b from-[#e8dfd4] via-[#ddd3c5] to-[#d4c8b8] border border-amber-800/30 rounded-2xl shadow-2xl shadow-black/30 flex flex-col overflow-hidden">

                {/* Decorative glow orbs */}
                <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-amber-400/15 blur-[100px] pointer-events-none hidden md:block" />
                <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-amber-300/10 blur-[80px] pointer-events-none hidden md:block" />

                {/* Header */}
                <div className="flex-shrink-0 relative px-5 md:px-10 py-5 md:py-6 border-b border-amber-800/20 bg-gradient-to-b from-amber-100/30 to-transparent">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-amber-800/70">Vanta Roastery</span>
                                <span className="text-[8px] uppercase tracking-wider bg-amber-700/20 text-amber-800 px-2 py-0.5 rounded-full">Today's Special</span>
                            </div>
                            <h2 className="font-serif text-2xl md:text-4xl text-amber-950">The Menu</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 mt-5 md:mt-6 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                                    activeCategory === cat.id
                                        ? "bg-amber-700 text-white"
                                        : "bg-amber-900/10 text-amber-900/70 hover:bg-amber-900/20 hover:text-amber-900"
                                )}
                            >
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto px-5 md:px-10 py-6 md:py-8">

                    {/* Coffee */}
                    {activeCategory === 'coffee' && (
                        <div className="space-y-1">
                            {COFFEE_MENU.map((item, idx) => {
                                const itemIdM = `coffee-${idx}-M`;
                                const itemIdL = `coffee-${idx}-L`;
                                return (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex items-start justify-between py-4 border-b border-amber-900/10 group",
                                            item.special && "bg-amber-700/10 -mx-4 px-4 rounded-lg border border-amber-700/30"
                                        )}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-serif text-lg text-amber-950 group-hover:text-amber-700 transition-colors">
                                                    {item.name}
                                                </span>
                                                {item.special && (
                                                    <span className="text-[8px] uppercase tracking-wider bg-amber-600/20 text-amber-700 px-2 py-0.5 rounded-full">
                                                        Limited
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-amber-800/60 text-sm mt-0.5">{item.desc}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Medium */}
                                            <button
                                                onClick={() => handleAddItem({
                                                    id: itemIdM,
                                                    name: item.name,
                                                    price: item.priceM,
                                                    size: 'M',
                                                    category: 'coffee'
                                                })}
                                                className={cn(
                                                    "flex flex-col items-center px-3 py-1.5 rounded-lg border transition-all",
                                                    addedItem === itemIdM
                                                        ? "bg-green-600/20 border-green-600/50 text-green-700"
                                                        : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                                                )}
                                            >
                                                <span className="text-[9px] uppercase tracking-wider opacity-60">M</span>
                                                <span className="font-medium text-sm">${item.priceM.toFixed(2)}</span>
                                            </button>
                                            {/* Large */}
                                            <button
                                                onClick={() => handleAddItem({
                                                    id: itemIdL,
                                                    name: item.name,
                                                    price: item.priceL,
                                                    size: 'L',
                                                    category: 'coffee'
                                                })}
                                                className={cn(
                                                    "flex flex-col items-center px-3 py-1.5 rounded-lg border transition-all",
                                                    addedItem === itemIdL
                                                        ? "bg-green-600/20 border-green-600/50 text-green-700"
                                                        : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                                                )}
                                            >
                                                <span className="text-[9px] uppercase tracking-wider opacity-60">L</span>
                                                <span className="font-medium text-sm">${item.priceL.toFixed(2)}</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Tea */}
                    {activeCategory === 'tea' && (
                        <div className="space-y-1">
                            {TEA_MENU.map((item, idx) => {
                                const itemIdM = `tea-${idx}-M`;
                                const itemIdL = `tea-${idx}-L`;
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-start justify-between py-4 border-b border-amber-900/10 group"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-serif text-lg text-amber-950 group-hover:text-amber-700 transition-colors">
                                                    {item.name}
                                                </span>
                                                {item.badge && (
                                                    <span className="text-[8px] uppercase tracking-wider bg-emerald-700/20 text-emerald-800 px-2 py-0.5 rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-amber-800/60 text-sm mt-0.5">{item.desc}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleAddItem({
                                                    id: itemIdM, name: item.name, price: item.priceM, size: 'M', category: 'tea'
                                                })}
                                                className={cn(
                                                    "flex flex-col items-center px-3 py-1.5 rounded-lg border transition-all",
                                                    addedItem === itemIdM ? "bg-green-600/20 border-green-600/50 text-green-700" : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                                                )}
                                            >
                                                <span className="text-[9px] uppercase tracking-wider opacity-60">M</span>
                                                <span className="font-medium text-sm">${item.priceM.toFixed(2)}</span>
                                            </button>
                                            <button
                                                onClick={() => handleAddItem({
                                                    id: itemIdL, name: item.name, price: item.priceL, size: 'L', category: 'tea'
                                                })}
                                                className={cn(
                                                    "flex flex-col items-center px-3 py-1.5 rounded-lg border transition-all",
                                                    addedItem === itemIdL ? "bg-green-600/20 border-green-600/50 text-green-700" : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                                                )}
                                            >
                                                <span className="text-[9px] uppercase tracking-wider opacity-60">L</span>
                                                <span className="font-medium text-sm">${item.priceL.toFixed(2)}</span>
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Spirits */}
                    {activeCategory === 'spirits' && (
                        <div className="space-y-1">
                            <p className="text-amber-800/70 text-sm mb-6 italic">☆ Coffee cocktails crafted with our specialty beans</p>
                            {ALCOHOL_MENU.map((item, idx) => {
                                const itemId = `spirits-${idx}`;
                                return (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex items-start justify-between py-4 border-b border-amber-900/10 group",
                                            item.special && "bg-amber-700/10 -mx-4 px-4 rounded-lg border border-amber-700/30"
                                        )}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-serif text-lg text-amber-950 group-hover:text-amber-700 transition-colors">
                                                    {item.name}
                                                </span>
                                                {item.special && (
                                                    <span className="text-[8px] uppercase tracking-wider bg-rose-700/20 text-rose-800 px-2 py-0.5 rounded-full">
                                                        ★ Signature
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-amber-800/60 text-sm mt-0.5">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAddItem({
                                                id: itemId, name: item.name, price: item.priceM, category: 'spirits'
                                            })}
                                            className={cn(
                                                "px-4 py-2 rounded-lg border font-medium transition-all",
                                                addedItem === itemId ? "bg-green-600/20 border-green-600/50 text-green-700" : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                                            )}
                                        >
                                            ${item.priceM.toFixed(2)}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Pastry */}
                    {activeCategory === 'pastry' && (
                        <div className="space-y-1">
                            <p className="text-amber-800/70 text-sm mb-6 italic">✦ Baked fresh daily by our in-house patissier</p>
                            {PASTRY_MENU.map((item, idx) => {
                                const itemId = `pastry-${idx}`;
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-start justify-between py-4 border-b border-amber-900/10 group"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-serif text-lg text-amber-950 group-hover:text-amber-700 transition-colors">
                                                    {item.name}
                                                </span>
                                                {item.badge && (
                                                    <span className="text-[8px] uppercase tracking-wider bg-amber-700/20 text-amber-800 px-2 py-0.5 rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-amber-800/60 text-sm mt-0.5">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAddItem({
                                                id: itemId, name: item.name, price: item.price, category: 'pastry'
                                            })}
                                            className={cn(
                                                "px-4 py-2 rounded-lg border font-medium transition-all",
                                                addedItem === itemId ? "bg-green-600/20 border-green-600/50 text-green-700" : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                                            )}
                                        >
                                            ${item.price.toFixed(2)}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Breakfast */}
                    {activeCategory === 'breakfast' && (
                        <div className="space-y-1">
                            <p className="text-amber-800/70 text-sm mb-6 italic">◇ Served until 2pm daily</p>
                            {BREAKFAST_MENU.map((item, idx) => {
                                const itemId = `breakfast-${idx}`;
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-start justify-between py-4 border-b border-amber-900/10 group"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-serif text-lg text-amber-950 group-hover:text-amber-700 transition-colors">
                                                    {item.name}
                                                </span>
                                                {item.badge && (
                                                    <span className={cn(
                                                        "text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full",
                                                        item.badge === 'Premium' ? "bg-violet-700/20 text-violet-800" :
                                                            item.badge === 'Healthy' ? "bg-emerald-700/20 text-emerald-800" :
                                                                "bg-amber-700/20 text-amber-800"
                                                    )}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-amber-800/60 text-sm mt-0.5">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAddItem({
                                                id: itemId, name: item.name, price: item.price, category: 'breakfast'
                                            })}
                                            className={cn(
                                                "px-4 py-2 rounded-lg border font-medium transition-all",
                                                addedItem === itemId ? "bg-green-600/20 border-green-600/50 text-green-700" : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
                                            )}
                                        >
                                            ${item.price.toFixed(2)}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-5 md:px-10 py-3 md:py-4 border-t border-amber-800/30 bg-gradient-to-t from-amber-950/20 to-transparent">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4 text-center md:text-left">
                        <p className="text-neutral-500 text-[10px] md:text-xs">
                            All prices exclude tax • Members save 15%
                        </p>
                        <div className="flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest text-amber-500/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
                            <span>Open Daily 6am — 10pm</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Hook for menu modal state
export const useMenuModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    return {
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
    };
};
