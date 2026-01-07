import React from 'react';
import { cn } from '../lib/utils';
import { Magnetic } from './Magnetic';

const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

const FOOTER_LINKS = {
    navigate: [
        { label: 'Home', section: 'hero' },
        { label: 'Philosophy', section: 'manifesto' },
        { label: 'Our Ritual', section: 'ritual' },
        { label: 'Quality', section: 'standard' },
        { label: 'Experience', section: 'atmosphere' },
        { label: 'Origins', section: 'origins' },
        { label: 'Subscribe', section: 'subscription' }
    ]
};

const SOCIALS = [
    {
        name: 'Instagram',
        href: '#',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        )
    },
    {
        name: 'Twitter',
        href: '#',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        )
    },
    {
        name: 'TikTok',
        href: '#',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
            </svg>
        )
    },
    {
        name: 'YouTube',
        href: '#',
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        )
    }
];

export const Footer: React.FC = () => {
    return (
        <footer className="relative w-full bg-[#080706] border-t border-white/5">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8">

                    {/* Brand Column */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 border border-white/20 flex items-center justify-center rounded-full bg-black/20">
                                <span className="font-serif text-white font-bold text-xl">V</span>
                            </div>
                            <span className="font-serif text-2xl text-white tracking-tight">VANTA</span>
                        </div>

                        <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mb-8">
                            Sourced from the top 1% of global micro-lots. Roasted in Los Angeles.
                            Shipped within 24 hours.
                        </p>

                        {/* Newsletter */}
                        <div className="max-w-sm">
                            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 mb-3">
                                Join the Ritual
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                                />
                                <button className="px-5 py-3 bg-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-amber-400 transition-colors">
                                    Join
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Navigate Links */}
                    <div className="lg:col-span-2">
                        <h4 className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold mb-6">
                            Explore
                        </h4>
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {FOOTER_LINKS.navigate.map((link) => (
                                <li key={link.label}>
                                    <button
                                        onClick={() => scrollToSection(link.section)}
                                        className="text-neutral-500 text-sm hover:text-amber-400 transition-colors duration-300 cursor-pointer"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Copyright */}
                    <div className="flex items-center gap-4 text-neutral-600 text-xs">
                        <span>© 2024 Vanta Roastery</span>
                        <span className="hidden md:inline">•</span>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {SOCIALS.map((social) => (
                            <Magnetic key={social.name} strength={0.3}>
                                <a
                                    href={social.href}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-neutral-500 hover:text-white hover:border-white/30 transition-all duration-300"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            </Magnetic>
                        ))}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-neutral-600 text-xs">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Los Angeles, CA</span>
                    </div>
                </div>
            </div>

            {/* Decorative Top Gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        </footer>
    );
};