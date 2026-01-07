import React from 'react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { Cursor } from './Cursor';

// ==============================================
// CART MODAL - CREAM THEME
// ==============================================
// Показывает содержимое корзины с возможностью
// изменять количество и оформить заказ

export const CartModal: React.FC = () => {
    const {
        items,
        total,
        isCartOpen,
        closeCart,
        removeItem,
        updateQuantity,
        openCheckout
    } = useCart();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-none">
            <Cursor />
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={closeCart}
            />

            {/* Modal - CREAM THEME */}
            <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-[#f5f0e8] via-[#ebe4d8] to-[#e8dfd0] border border-[#d4c4a8]/50 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-[#d4c4a8]/50 flex items-center justify-between bg-white/30">
                    <div>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#8b7355]">Vanta Roastery</span>
                        <h2 className="font-serif text-2xl text-[#2c2418]">Your Cart</h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-9 h-9 rounded-full bg-[#2c2418]/10 border border-[#2c2418]/20 flex items-center justify-center text-[#6b5640] hover:text-[#2c2418] hover:bg-[#2c2418]/20 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="max-h-[50vh] overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#8b7355]/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#8b7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-[#6b5640] font-medium">Your cart is empty</p>
                            <p className="text-[#8b7355] text-sm mt-1">Add some delicious items from our menu</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 py-3 border-b border-[#d4c4a8]/30 last:border-0"
                                >
                                    {/* Item Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-serif text-[#2c2418]">{item.name}</span>
                                            {item.size && (
                                                <span className="text-[9px] uppercase tracking-wider bg-[#8b7355]/20 text-[#6b5640] px-1.5 py-0.5 rounded">
                                                    {item.size}
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[#8b7355] text-sm font-medium">${item.price.toFixed(2)}</span>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-7 h-7 rounded-full bg-white border border-[#d4c4a8] flex items-center justify-center text-[#6b5640] hover:bg-[#f5f0e8] transition-all"
                                        >
                                            −
                                        </button>
                                        <span className="w-6 text-center text-[#2c2418] font-medium">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-7 h-7 rounded-full bg-white border border-[#d4c4a8] flex items-center justify-center text-[#6b5640] hover:bg-[#f5f0e8] transition-all"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-[#8b7355] hover:text-red-500 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="px-6 py-4 border-t border-[#d4c4a8]/50 bg-white/40">
                        {/* Total */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[#6b5640]">Total</span>
                            <span className="font-serif text-2xl text-[#2c2418]">${total.toFixed(2)}</span>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={openCheckout}
                            className="w-full py-3 rounded-full bg-gradient-to-r from-[#8b7355] to-[#6b5640] text-white font-medium uppercase tracking-wider hover:from-[#7a6548] hover:to-[#5a4835] transition-all shadow-lg shadow-[#8b7355]/20"
                        >
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
