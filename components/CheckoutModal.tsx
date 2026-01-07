import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/supabase';
import { notifyNewOrder } from '../lib/telegram';
import { Cursor } from './Cursor';

// ==============================================
// CHECKOUT MODAL - CREAM THEME
// ==============================================
// Форма оформления заказа
// Собирает данные клиента и отправляет заказ

export const CheckoutModal: React.FC = () => {
    const { items, total, isCheckoutOpen, closeCheckout, clearCart } = useCart();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isCheckoutOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // 1. Создаём заказ в базе данных
            const order = await createOrder({
                customer_name: name,
                customer_phone: phone,
                items,
                total
            });

            if (!order) {
                throw new Error('Failed to create order');
            }

            // 2. Отправляем уведомление в Telegram
            await notifyNewOrder(order);

            // 3. Показываем успех и очищаем корзину
            setIsSuccess(true);
            clearCart();
            // Модалка остаётся открытой - пользователь сам закроет

        } catch (err) {
            console.error('Order failed:', err);
            setError('Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-none">
            <Cursor />
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 md:backdrop-blur-md"
                onClick={!isSubmitting ? closeCheckout : undefined}
            />

            {/* Modal - CREAM THEME */}
            <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-[#f5f0e8] via-[#ebe4d8] to-[#e8dfd0] border border-[#d4c4a8]/50 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-[#d4c4a8]/50 flex items-center justify-between bg-white/30">
                    <div>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#8b7355]">Vanta Roastery</span>
                        <h2 className="font-serif text-2xl text-[#2c2418]">Checkout</h2>
                    </div>
                    <button
                        onClick={closeCheckout}
                        disabled={isSubmitting}
                        className="w-9 h-9 rounded-full bg-[#2c2418]/10 border border-[#2c2418]/20 flex items-center justify-center text-[#6b5640] hover:text-[#2c2418] hover:bg-[#2c2418]/20 transition-all disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    {isSuccess ? (
                        // Success State
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-2xl text-[#2c2418] mb-2">Order Placed!</h3>
                            <p className="text-[#6b5640]">We'll prepare your order shortly.</p>
                            <p className="text-[#8b7355] text-sm mt-2">Check your phone for confirmation</p>
                            <button
                                onClick={() => { setIsSuccess(false); setName(''); setPhone(''); closeCheckout(); }}
                                className="mt-6 px-8 py-2 rounded-full bg-[#2c2418] text-white text-sm uppercase tracking-wider hover:bg-[#3d3222] transition-all"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        // Form
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Order Summary */}
                            <div className="bg-white/60 rounded-xl p-4 mb-6 border border-[#d4c4a8]/30">
                                <div className="text-[10px] uppercase tracking-widest text-[#8b7355] mb-2">Order Summary</div>
                                <div className="space-y-1">
                                    {items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-[#5a4835]">
                                                {item.name} {item.size && `(${item.size})`} ×{item.quantity}
                                            </span>
                                            <span className="text-[#6b5640] font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-[#d4c4a8]/50 mt-3 pt-3 flex justify-between">
                                    <span className="text-[#2c2418] font-medium">Total</span>
                                    <span className="text-[#2c2418] font-bold">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Name Input */}
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#8b7355] mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 bg-white border border-[#d4c4a8] rounded-xl text-[#2c2418] placeholder-[#b8a88a] focus:outline-none focus:border-[#8b7355] transition-colors"
                                />
                            </div>

                            {/* Phone Input */}
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#8b7355] mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    placeholder="+1 (555) 123-4567"
                                    className="w-full px-4 py-3 bg-white border border-[#d4c4a8] rounded-xl text-[#2c2418] placeholder-[#b8a88a] focus:outline-none focus:border-[#8b7355] transition-colors"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="text-red-600 text-sm text-center bg-red-100 rounded-lg py-2 border border-red-200">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !name || !phone}
                                className="w-full py-3 rounded-full bg-gradient-to-r from-[#8b7355] to-[#6b5640] text-white font-medium uppercase tracking-wider hover:from-[#7a6548] hover:to-[#5a4835] transition-all shadow-lg shadow-[#8b7355]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>Place Order — ${total.toFixed(2)}</span>
                                )}
                            </button>

                            {/* Secure note */}
                            <p className="text-center text-[#8b7355] text-[10px] uppercase tracking-wider">
                                🔒 Pay on pickup • Secure checkout
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
