import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Order, Reservation } from '../lib/supabase';
import { Cursor } from './Cursor';

// ==============================================
// ADMIN PANEL - CREAM/BEIGE THEME
// ==============================================
// Красивая панель управления для владельца кофейни
// Кремовый/бежевый дизайн, премиум эстетика

const ADMIN_PASSWORD = 'vanta2024';

export const AdminPanel: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [activeTab, setActiveTab] = useState<'orders' | 'reservations'>('orders');
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        const { data: ordersData } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);

        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const { data: reservationsData } = await supabase
            .from('reservations')
            .select('*')
            .gte('date', today)
            .lte('date', nextWeek)
            .order('date', { ascending: true });

        setOrders(ordersData || []);
        setReservations(reservationsData || []);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchData();

        const ordersSubscription = supabase
            .channel('orders-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'orders' },
                () => fetchData()
            )
            .subscribe();

        const reservationsSubscription = supabase
            .channel('reservations-channel')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'reservations' },
                () => fetchData()
            )
            .subscribe();

        return () => {
            ordersSubscription.unsubscribe();
            reservationsSubscription.unsubscribe();
        };
    }, [isAuthenticated, fetchData]);

    const updateOrderStatus = async (id: number, status: string) => {
        await supabase.from('orders').update({ status }).eq('id', id);
        fetchData();
    };

    const updateReservationStatus = async (id: number, status: string) => {
        await supabase.from('reservations').update({ status }).eq('id', id);
        fetchData();
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setPasswordError(false);
        } else {
            setPasswordError(true);
        }
    };

    // Статистика
    const todayOrders = orders.filter(o =>
        o.created_at?.startsWith(new Date().toISOString().split('T')[0])
    );
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const todayReservations = reservations.filter(r =>
        r.date === new Date().toISOString().split('T')[0]
    ).length;

    // ========================
    // ЭКРАН ВХОДА - КРЕМОВЫЙ
    // ========================
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f5f0e8] via-[#ebe4d8] to-[#e8dfd0] flex items-center justify-center p-4 cursor-none">
                <Cursor />
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />

                <div className="relative w-full max-w-sm">
                    {/* Logo */}
                    <div className="text-center mb-10">
                        <h1 className="font-serif text-5xl text-[#2c2418] tracking-[0.3em] mb-3">VANTA</h1>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-8 h-[1px] bg-[#8b7355]" />
                            <p className="text-[#8b7355] text-[10px] tracking-[0.5em] uppercase">Admin Portal</p>
                            <div className="w-8 h-[1px] bg-[#8b7355]" />
                        </div>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl shadow-black/5 border border-[#d4c4a8]/30">
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#8b7355] mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter access code"
                                    className={`w-full px-5 py-4 bg-[#f8f5f0] border rounded-xl text-[#2c2418] placeholder-[#b8a88a] focus:outline-none transition-all ${passwordError
                                        ? 'border-red-400 focus:border-red-500'
                                        : 'border-[#d4c4a8] focus:border-[#8b7355]'
                                        }`}
                                />
                                {passwordError && (
                                    <p className="text-red-500 text-sm mt-2">Incorrect password</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#8b7355] to-[#6b5640] text-white font-medium uppercase tracking-[0.2em] hover:from-[#7a6548] hover:to-[#5a4835] transition-all shadow-lg shadow-[#8b7355]/20"
                            >
                                Access Dashboard
                            </button>
                        </form>
                    </div>

                    {/* Back link */}
                    <a
                        href="/"
                        className="block text-center mt-8 text-[#8b7355] text-sm hover:text-[#5a4835] transition-colors"
                    >
                        ← Return to Vanta
                    </a>
                </div>
            </div>
        );
    }

    // ========================
    // ГЛАВНАЯ ПАНЕЛЬ - КРЕМОВАЯ
    // ========================
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f0e8] via-[#ebe4d8] to-[#e8dfd0] cursor-none">
            <Cursor />
            {/* Header */}
            <header className="border-b border-[#d4c4a8]/50 bg-white/60 backdrop-blur-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-2xl text-[#2c2418] tracking-[0.2em]">VANTA</h1>
                        <p className="text-[#8b7355] text-[10px] tracking-[0.3em] uppercase">Management</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchData}
                            className="p-2.5 rounded-xl bg-[#f5f0e8] border border-[#d4c4a8] hover:bg-[#ebe4d8] transition-all text-[#6b5640]"
                            title="Refresh"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                        <a
                            href="/"
                            className="px-5 py-2.5 rounded-xl bg-[#2c2418] text-white text-sm uppercase tracking-wider hover:bg-[#3d3222] transition-all"
                        >
                            View Site
                        </a>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/70 backdrop-blur-sm border border-[#d4c4a8]/30 rounded-2xl p-6 shadow-sm">
                        <p className="text-[#8b7355] text-[10px] uppercase tracking-[0.15em] mb-1">Today's Orders</p>
                        <p className="font-serif text-4xl text-[#2c2418]">{todayOrders.length}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm border border-[#d4c4a8]/30 rounded-2xl p-6 shadow-sm">
                        <p className="text-[#6b8f71] text-[10px] uppercase tracking-[0.15em] mb-1">Revenue</p>
                        <p className="font-serif text-4xl text-[#2c2418]">${todayRevenue.toFixed(0)}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm border border-[#d4c4a8]/30 rounded-2xl p-6 shadow-sm">
                        <p className="text-[#c4873a] text-[10px] uppercase tracking-[0.15em] mb-1">Pending</p>
                        <p className="font-serif text-4xl text-[#2c2418]">{pendingOrders}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm border border-[#d4c4a8]/30 rounded-2xl p-6 shadow-sm">
                        <p className="text-[#5a7a9a] text-[10px] uppercase tracking-[0.15em] mb-1">Reservations</p>
                        <p className="font-serif text-4xl text-[#2c2418]">{todayReservations}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-2.5 rounded-full text-sm uppercase tracking-wider transition-all ${activeTab === 'orders'
                            ? 'bg-[#2c2418] text-white'
                            : 'bg-white/70 text-[#6b5640] border border-[#d4c4a8] hover:bg-white'
                            }`}
                    >
                        Orders ({orders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('reservations')}
                        className={`px-6 py-2.5 rounded-full text-sm uppercase tracking-wider transition-all ${activeTab === 'reservations'
                            ? 'bg-[#2c2418] text-white'
                            : 'bg-white/70 text-[#6b5640] border border-[#d4c4a8] hover:bg-white'
                            }`}
                    >
                        Reservations ({reservations.length})
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="w-8 h-8 border-2 border-[#d4c4a8] border-t-[#8b7355] rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-[#8b7355]">Loading...</p>
                    </div>
                ) : activeTab === 'orders' ? (
                    <div className="bg-white/70 backdrop-blur-sm border border-[#d4c4a8]/30 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#d4c4a8]/30 text-left bg-[#f8f5f0]/50">
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">ID</th>
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">Customer</th>
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">Items</th>
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">Total</th>
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">Status</th>
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-5 py-16 text-center text-[#8b7355]">
                                                <div className="text-4xl mb-2">☕</div>
                                                No orders yet
                                            </td>
                                        </tr>
                                    ) : orders.map(order => (
                                        <tr key={order.id} className="border-b border-[#d4c4a8]/20 hover:bg-[#f8f5f0]/50 transition-colors">
                                            <td className="px-5 py-4 text-[#8b7355] font-medium">#{order.id}</td>
                                            <td className="px-5 py-4">
                                                <p className="text-[#2c2418] font-medium">{order.customer_name}</p>
                                                <p className="text-[#8b7355] text-sm">{order.customer_phone}</p>
                                            </td>
                                            <td className="px-5 py-4 text-[#5a4835] text-sm">
                                                {order.items.map((item, i) => (
                                                    <span key={i}>
                                                        {item.name}{item.size ? ` (${item.size})` : ''} ×{item.quantity}
                                                        {i < order.items.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="px-5 py-4 text-[#2c2418] font-semibold">${order.total.toFixed(2)}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium ${order.status === 'pending' ? 'bg-[#fef3cd] text-[#856404]' :
                                                    order.status === 'completed' ? 'bg-[#d4edda] text-[#155724]' :
                                                        'bg-[#f8d7da] text-[#721c24]'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-2">
                                                    {order.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateOrderStatus(order.id!, 'completed')}
                                                                className="px-3 py-1.5 rounded-lg bg-[#d4edda] text-[#155724] text-xs font-medium hover:bg-[#c3e6cb] transition-all"
                                                            >
                                                                ✓ Done
                                                            </button>
                                                            <button
                                                                onClick={() => updateOrderStatus(order.id!, 'cancelled')}
                                                                className="px-3 py-1.5 rounded-lg bg-[#f8d7da] text-[#721c24] text-xs font-medium hover:bg-[#f5c6cb] transition-all"
                                                            >
                                                                ✕ Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/70 backdrop-blur-sm border border-[#d4c4a8]/30 rounded-2xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#d4c4a8]/30 text-left bg-[#f8f5f0]/50">
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">ID</th>
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">Guest</th>
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">Date & Time</th>
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">Party</th>
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">Notes</th>
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">Status</th>
                                        <th className="px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#8b7355] font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-5 py-16 text-center text-[#8b7355]">
                                                <div className="text-4xl mb-2">🪑</div>
                                                No reservations this week
                                            </td>
                                        </tr>
                                    ) : reservations.map(res => (
                                        <tr key={res.id} className="border-b border-[#d4c4a8]/20 hover:bg-[#f8f5f0]/50 transition-colors">
                                            <td className="px-5 py-4 text-[#8b7355] font-medium">#{res.id}</td>
                                            <td className="px-5 py-4">
                                                <p className="text-[#2c2418] font-medium">{res.customer_name}</p>
                                                <p className="text-[#8b7355] text-sm">{res.customer_contact}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-[#2c2418]">{res.date}</p>
                                                <p className="text-[#8b7355] text-sm">{res.time}</p>
                                            </td>
                                            <td className="px-5 py-4 text-[#2c2418]">{res.guests} guests</td>
                                            <td className="px-5 py-4 text-[#8b7355] text-sm max-w-[200px] truncate">
                                                {res.notes || '—'}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-3 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium ${res.status === 'pending' ? 'bg-[#fef3cd] text-[#856404]' :
                                                    res.status === 'confirmed' ? 'bg-[#d4edda] text-[#155724]' :
                                                        'bg-[#f8d7da] text-[#721c24]'
                                                    }`}>
                                                    {res.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex gap-2">
                                                    {res.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateReservationStatus(res.id!, 'confirmed')}
                                                                className="px-3 py-1.5 rounded-lg bg-[#d4edda] text-[#155724] text-xs font-medium hover:bg-[#c3e6cb] transition-all"
                                                            >
                                                                ✓ Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => updateReservationStatus(res.id!, 'cancelled')}
                                                                className="px-3 py-1.5 rounded-lg bg-[#f8d7da] text-[#721c24] text-xs font-medium hover:bg-[#f5c6cb] transition-all"
                                                            >
                                                                ✕ Cancel
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Real-time indicator */}
                <div className="mt-8 flex items-center justify-center gap-2 text-[#8b7355] text-sm">
                    <span className="w-2 h-2 rounded-full bg-[#6b8f71] animate-pulse" />
                    <span>Live updates active</span>
                </div>
            </main>
        </div>
    );
};
