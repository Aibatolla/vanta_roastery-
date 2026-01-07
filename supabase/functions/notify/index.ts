// Supabase Edge Function для отправки уведомлений в Telegram
// Токен хранится как секрет на сервере, не виден клиенту

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID')

interface OrderItem {
    name: string
    size?: string
    quantity: number
    price: number
}

interface OrderPayload {
    type: 'order'
    id: number
    customer_name: string
    customer_phone: string
    items: OrderItem[]
    total: number
}

interface ReservationPayload {
    type: 'reservation'
    id: number
    customer_name: string
    customer_contact: string
    date: string
    time: string
    guests: number
    notes?: string
}

interface SubscriptionPayload {
    type: 'subscription'
    customer_name: string
    customer_phone: string
    plan: string
    price: number
}

type NotifyPayload = OrderPayload | ReservationPayload | SubscriptionPayload

async function sendTelegramMessage(message: string): Promise<boolean> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.error('Telegram credentials not configured')
        return false
    }

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            }
        )

        const data = await response.json()
        return data.ok === true
    } catch (error) {
        console.error('Failed to send Telegram message:', error)
        return false
    }
}

function formatOrderMessage(order: OrderPayload): string {
    const itemsList = order.items
        .map(item => {
            const size = item.size ? ` (${item.size})` : ''
            return `  • ${item.name}${size} x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}`
        })
        .join('\n')

    return `
🆕 <b>Новый заказ #${order.id}</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Клиент:</b> ${order.customer_name}
📞 <b>Телефон:</b> ${order.customer_phone}
━━━━━━━━━━━━━━━━━━
🛒 <b>Заказ:</b>
${itemsList}
━━━━━━━━━━━━━━━━━━
💰 <b>Итого:</b> $${order.total.toFixed(2)}
`.trim()
}

function formatReservationMessage(reservation: ReservationPayload): string {
    return `
🪑 <b>Новая бронь #${reservation.id}</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Имя:</b> ${reservation.customer_name}
📅 <b>Дата:</b> ${reservation.date}
🕐 <b>Время:</b> ${reservation.time}
👥 <b>Гостей:</b> ${reservation.guests}
📱 <b>Контакт:</b> ${reservation.customer_contact}
${reservation.notes ? `📝 <b>Заметки:</b> ${reservation.notes}` : ''}
━━━━━━━━━━━━━━━━━━
`.trim()
}

function formatSubscriptionMessage(subscription: SubscriptionPayload): string {
    return `
☕ <b>Новая подписка!</b>
━━━━━━━━━━━━━━━━━━
👤 <b>Имя:</b> ${subscription.customer_name}
📞 <b>Телефон:</b> ${subscription.customer_phone}
📦 <b>План:</b> ${subscription.plan}
💰 <b>Цена:</b> $${subscription.price}/мес
━━━━━━━━━━━━━━━━━━
`.trim()
}

serve(async (req) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Content-Type': 'application/json'
    }

    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers })
    }

    try {
        const payload: NotifyPayload = await req.json()

        let message: string
        if (payload.type === 'order') {
            message = formatOrderMessage(payload as OrderPayload)
        } else if (payload.type === 'reservation') {
            message = formatReservationMessage(payload as ReservationPayload)
        } else if (payload.type === 'subscription') {
            message = formatSubscriptionMessage(payload as SubscriptionPayload)
        } else {
            return new Response(
                JSON.stringify({ error: 'Invalid payload type' }),
                { status: 400, headers }
            )
        }

        const success = await sendTelegramMessage(message)

        return new Response(
            JSON.stringify({ success }),
            { status: success ? 200 : 500, headers }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: 'Failed to process request' }),
            { status: 500, headers }
        )
    }
})
