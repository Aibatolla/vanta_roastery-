import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { CartItem } from '../lib/supabase';

// ==============================================
// CART CONTEXT
// ==============================================
// Этот контекст управляет состоянием корзины
// Он доступен во всём приложении

interface CartContextType {
    items: CartItem[];
    itemCount: number;
    total: number;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    isCheckoutOpen: boolean;
    openCheckout: () => void;
    closeCheckout: () => void;
    // Toast
    toastMessage: string;
    isToastVisible: boolean;
    hideToast: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

// ==============================================
// CART PROVIDER
// ==============================================

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isToastVisible, setIsToastVisible] = useState(false);

    const showToast = useCallback((message: string) => {
        setToastMessage(message);
        setIsToastVisible(true);
    }, []);

    const hideToast = useCallback(() => {
        setIsToastVisible(false);
    }, []);

    // Добавить товар в корзину
    const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
        setItems(currentItems => {
            // Проверяем есть ли уже такой товар (с тем же размером)
            const existingIndex = currentItems.findIndex(
                item => item.id === newItem.id && item.size === newItem.size
            );

            if (existingIndex >= 0) {
                // Увеличиваем количество
                const updated = [...currentItems];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + 1
                };
                return updated;
            }

            // Добавляем новый товар
            return [...currentItems, { ...newItem, quantity: 1 }];
        });
        // Показываем toast
        showToast(`${newItem.name} added to cart`);
    }, [showToast]);

    // Удалить товар из корзины
    const removeItem = useCallback((itemId: string) => {
        setItems(current => current.filter(item => item.id !== itemId));
    }, []);

    // Изменить количество
    const updateQuantity = useCallback((itemId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(itemId);
            return;
        }
        setItems(current =>
            current.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            )
        );
    }, [removeItem]);

    // Очистить корзину
    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    // Подсчёт итогов
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Модалки
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);
    const openCheckout = () => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
    };
    const closeCheckout = () => setIsCheckoutOpen(false);

    return (
        <CartContext.Provider value={{
            items,
            itemCount,
            total,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            isCartOpen,
            openCart,
            closeCart,
            isCheckoutOpen,
            openCheckout,
            closeCheckout,
            toastMessage,
            isToastVisible,
            hideToast
        }}>
            {children}
        </CartContext.Provider>
    );
};

// ==============================================
// HOOK ДЛЯ ИСПОЛЬЗОВАНИЯ КОРЗИНЫ
// ==============================================

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
