import React, { useState } from 'react';
import { createReservation } from '../lib/supabase';
import { notifyNewReservation } from '../lib/telegram';
import { Cursor } from './Cursor';

// ==============================================
// RESERVATION MODAL - CREAM THEME
// ==============================================
// Форма для бронирования столика

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [guests, setGuests] = useState(2);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // Minimum date = today
    const today = new Date().toISOString().split('T')[0];

    if (!isOpen) return null;

    const resetForm = () => {
        setName('');
        setContact('');
        setDate('');
        setTime('');
        setGuests(2);
        setNotes('');
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // 1. Создаём бронь в базе данных
            const reservation = await createReservation({
                customer_name: name,
                customer_contact: contact,
                date,
                time,
                guests,
                notes: notes || undefined
            });

            if (!reservation) {
                throw new Error('Failed to create reservation');
            }

            // 2. Отправляем уведомление в Telegram
            await notifyNewReservation(reservation);

            // 3. Показываем успех
            setIsSuccess(true);

        } catch (err) {
            console.error('Reservation failed:', err);
            setError('Failed to make reservation. Please try again.');
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
                onClick={!isSubmitting ? onClose : undefined}
            />

            {/* Modal - CREAM THEME */}
            <div className="relative z-10 w-full max-w-md bg-gradient-to-b from-[#f5f0e8] via-[#ebe4d8] to-[#e8dfd0] border border-[#d4c4a8]/50 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-[#d4c4a8]/50 flex items-center justify-between bg-white/30">
                    <div>
                        <span className="text-[9px] uppercase tracking-[0.3em] text-[#8b7355]">Vanta Roastery</span>
                        <h2 className="font-serif text-2xl text-[#2c2418]">Reserve a Table</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="w-9 h-9 rounded-full bg-[#2c2418]/10 border border-[#2c2418]/20 flex items-center justify-center text-[#6b5640] hover:text-[#2c2418] hover:bg-[#2c2418]/20 transition-all disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                    {isSuccess ? (
                        // Success State
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-serif text-2xl text-[#2c2418] mb-2">Reserved!</h3>
                            <p className="text-[#6b5640]">Your table has been booked.</p>
                            <p className="text-[#8b7355] text-sm mt-2">We'll contact you to confirm</p>
                            <button
                                onClick={() => { setIsSuccess(false); resetForm(); onClose(); }}
                                className="mt-6 px-8 py-2 rounded-full bg-[#2c2418] text-white text-sm uppercase tracking-wider hover:bg-[#3d3222] transition-all"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        // Form
                        <form onSubmit={handleSubmit} className="space-y-5">
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

                            {/* Contact Input */}
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#8b7355] mb-2">
                                    Contact (Email or Telegram)
                                </label>
                                <input
                                    type="text"
                                    value={contact}
                                    onChange={(e) => setContact(e.target.value)}
                                    required
                                    placeholder="@username or email@example.com"
                                    className="w-full px-4 py-3 bg-white border border-[#d4c4a8] rounded-xl text-[#2c2418] placeholder-[#b8a88a] focus:outline-none focus:border-[#8b7355] transition-colors"
                                />
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-[#8b7355] mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={today}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-[#d4c4a8] rounded-xl text-[#2c2418] focus:outline-none focus:border-[#8b7355] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-[#8b7355] mb-2">
                                        Time
                                    </label>
                                    <select
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-[#d4c4a8] rounded-xl text-[#2c2418] focus:outline-none focus:border-[#8b7355] transition-colors"
                                    >
                                        <option value="">Select time</option>
                                        <option value="08:00">8:00 AM</option>
                                        <option value="09:00">9:00 AM</option>
                                        <option value="10:00">10:00 AM</option>
                                        <option value="11:00">11:00 AM</option>
                                        <option value="12:00">12:00 PM</option>
                                        <option value="13:00">1:00 PM</option>
                                        <option value="14:00">2:00 PM</option>
                                        <option value="15:00">3:00 PM</option>
                                        <option value="16:00">4:00 PM</option>
                                        <option value="17:00">5:00 PM</option>
                                        <option value="18:00">6:00 PM</option>
                                        <option value="19:00">7:00 PM</option>
                                        <option value="20:00">8:00 PM</option>
                                    </select>
                                </div>
                            </div>

                            {/* Guests */}
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#8b7355] mb-3">
                                    Number of Guests
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setGuests(num)}
                                            className={`flex-1 py-3 rounded-xl border transition-all font-medium ${guests === num
                                                ? 'bg-[#8b7355] border-[#6b5640] text-white'
                                                : 'bg-white border-[#d4c4a8] text-[#6b5640] hover:border-[#8b7355]'
                                                }`}
                                        >
                                            {num}{num === 6 ? '+' : ''}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-[#8b7355] mb-2">
                                    Special Requests (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Window seat, birthday celebration, etc."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border border-[#d4c4a8] rounded-xl text-[#2c2418] placeholder-[#b8a88a] focus:outline-none focus:border-[#8b7355] transition-colors resize-none"
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
                                disabled={isSubmitting || !name || !contact || !date || !time}
                                className="w-full py-3 rounded-full bg-gradient-to-r from-[#8b7355] to-[#6b5640] text-white font-medium uppercase tracking-wider hover:from-[#7a6548] hover:to-[#5a4835] transition-all shadow-lg shadow-[#8b7355]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Reserving...</span>
                                    </>
                                ) : (
                                    <span>Reserve Table</span>
                                )}
                            </button>

                            {/* Hours note */}
                            <p className="text-center text-[#8b7355] text-[10px] uppercase tracking-wider">
                                Open Daily 6am — 10pm
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
