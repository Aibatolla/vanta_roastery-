import React, { useEffect, useState } from 'react';

// ==============================================
// TOAST NOTIFICATION
// ==============================================
// Показывает временные уведомления о добавлении в корзину

interface ToastProps {
    message: string;
    isVisible: boolean;
    onHide: () => void;
    type?: 'success' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onHide, type = 'success' }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(onHide, 2500);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onHide]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] animate-slide-up">
            <div className={`
                flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl backdrop-blur-lg
                ${type === 'success'
                    ? 'bg-gradient-to-r from-amber-900/90 to-amber-800/90 border border-amber-500/30'
                    : 'bg-white/10 border border-white/20'
                }
            `}>
                {/* Icon */}
                <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    ${type === 'success' ? 'bg-amber-500/30' : 'bg-white/20'}
                `}>
                    <svg
                        className={`w-4 h-4 ${type === 'success' ? 'text-amber-300' : 'text-white'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                {/* Message */}
                <span className="text-white text-sm font-medium">{message}</span>

                {/* Cart icon */}
                <svg
                    className="w-4 h-4 text-amber-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </div>
        </div>
    );
};
