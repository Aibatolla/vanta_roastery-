import type { Order, Reservation } from './supabase';

// ==============================================
// TELEGRAM NOTIFICATION SERVICE
// ==============================================
// Уведомления отправляются через Supabase Edge Function
// Токен хранится на сервере, не виден в клиентском коде

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Отправить уведомление через Edge Function
 */
async function sendNotification(payload: object): Promise<boolean> {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/functions/v1/notify`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();
        return data.success === true;
    } catch {
        return false;
    }
}

/**
 * Уведомление о новом заказе
 */
export async function notifyNewOrder(order: Order): Promise<boolean> {
    return sendNotification({
        type: 'order',
        id: order.id,
        customer_name: order.customer_name,
        customer_phone: order.customer_phone,
        items: order.items,
        total: order.total
    });
}

/**
 * Уведомление о новом бронировании
 */
export async function notifyNewReservation(reservation: Reservation): Promise<boolean> {
    return sendNotification({
        type: 'reservation',
        id: reservation.id,
        customer_name: reservation.customer_name,
        customer_contact: reservation.customer_contact,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        notes: reservation.notes
    });
}

/**
 * Уведомление о новой подписке
 */
export async function sendSubscriptionNotification(data: {
    name: string;
    phone: string;
    plan: string;
    price: number;
}): Promise<boolean> {
    return sendNotification({
        type: 'subscription',
        customer_name: data.name,
        customer_phone: data.phone,
        plan: data.plan,
        price: data.price
    });
}
