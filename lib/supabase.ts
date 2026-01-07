import { createClient } from '@supabase/supabase-js';

// ==============================================
// SUPABASE CLIENT
// ==============================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ==============================================
// ТИПЫ ДАННЫХ
// ==============================================

export interface CartItem {
    id: string;
    name: string;
    price: number;
    size?: 'M' | 'L';
    quantity: number;
    category: string;
}

export interface Order {
    id?: number;
    customer_name: string;
    customer_phone: string;
    items: CartItem[];
    total: number;
    status?: string;
    created_at?: string;
}

export interface Reservation {
    id?: number;
    customer_name: string;
    customer_contact: string;
    date: string;
    time: string;
    guests: number;
    notes?: string;
    status?: string;
    created_at?: string;
}

// ==============================================
// ВАЛИДАЦИЯ И САНИТИЗАЦИЯ
// ==============================================

/**
 * Очистка строки от опасных символов
 */
function sanitize(str: string): string {
    return str
        .trim()
        .replace(/[<>]/g, '') // Убираем HTML теги
        .slice(0, 500); // Лимит длины
}

/**
 * Валидация телефона (базовая)
 */
function isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 7 && cleaned.length <= 15;
}

/**
 * Валидация даты (не в прошлом)
 */
function isValidDate(date: string): boolean {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d instanceof Date && !isNaN(d.getTime()) && d >= today;
}

// ==============================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С ЗАКАЗАМИ
// ==============================================

/**
 * Создать новый заказ с валидацией
 */
export async function createOrder(
    order: Omit<Order, 'id' | 'created_at' | 'status'>
): Promise<Order | null> {
    // Валидация
    if (!order.customer_name || order.customer_name.trim().length < 2) {
        return null;
    }
    if (!isValidPhone(order.customer_phone)) {
        return null;
    }
    if (!order.items || order.items.length === 0) {
        return null;
    }

    // Санитизация
    const sanitizedOrder = {
        customer_name: sanitize(order.customer_name),
        customer_phone: sanitize(order.customer_phone),
        items: order.items,
        total: Math.round(order.total * 100) / 100, // Округляем до центов
        status: 'pending'
    };

    const { data, error } = await supabase
        .from('orders')
        .insert([sanitizedOrder])
        .select()
        .single();

    if (error) {
        return null;
    }

    return data;
}

// ==============================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С БРОНИРОВАНИЕМ
// ==============================================

/**
 * Создать бронирование с валидацией
 */
export async function createReservation(
    reservation: Omit<Reservation, 'id' | 'created_at' | 'status'>
): Promise<Reservation | null> {
    // Валидация
    if (!reservation.customer_name || reservation.customer_name.trim().length < 2) {
        return null;
    }
    if (!reservation.customer_contact || reservation.customer_contact.trim().length < 3) {
        return null;
    }
    if (!isValidDate(reservation.date)) {
        return null;
    }
    if (!reservation.time) {
        return null;
    }
    if (reservation.guests < 1 || reservation.guests > 20) {
        return null;
    }

    // Санитизация
    const sanitizedReservation = {
        customer_name: sanitize(reservation.customer_name),
        customer_contact: sanitize(reservation.customer_contact),
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        notes: reservation.notes ? sanitize(reservation.notes) : null,
        status: 'pending'
    };

    const { data, error } = await supabase
        .from('reservations')
        .insert([sanitizedReservation])
        .select()
        .single();

    if (error) {
        return null;
    }

    return data;
}

// ==============================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С ПОДПИСКАМИ
// ==============================================

export interface Subscription {
    id?: number;
    customer_name: string;
    customer_phone: string;
    plan: string;
    price: number;
    status?: string;
    created_at?: string;
}

/**
 * Создать подписку с валидацией
 */
export async function createSubscription(
    subscription: Omit<Subscription, 'id' | 'created_at' | 'status'>
): Promise<Subscription | null> {
    // Валидация
    if (!subscription.customer_name || subscription.customer_name.trim().length < 2) {
        return null;
    }
    if (!isValidPhone(subscription.customer_phone)) {
        return null;
    }
    if (!subscription.plan) {
        return null;
    }

    // Санитизация
    const sanitizedSubscription = {
        customer_name: sanitize(subscription.customer_name),
        customer_phone: sanitize(subscription.customer_phone),
        plan: subscription.plan,
        price: subscription.price,
        status: 'pending'
    };

    const { data, error } = await supabase
        .from('subscriptions')
        .insert([sanitizedSubscription])
        .select()
        .single();

    if (error) {
        return null;
    }

    return data;
}
