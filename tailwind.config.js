/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['Cinzel', 'serif'],
                sans: ['Manrope', 'sans-serif'],
            },
            colors: {
                coffee: {
                    white: '#FFFFFF',
                    accent: '#C47A3A',
                    gold: '#FFE5B4',
                    bg: '#12100E',
                },
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'slide-up': 'slideUp 0.8s ease-out forwards',
                'premium-shimmer': 'premiumShimmer 8s linear infinite',
                'hero-drift': 'heroDrift 20s ease-in-out infinite alternate',
                'badge-pulse-shadow': 'badgePulseShadow 5s ease-in-out infinite',
                'text-glow-breath': 'textGlowBreath 6s ease-in-out infinite',
                'ember-flicker': 'emberFlicker 4s ease-in-out infinite',
                'marquee': 'marquee 15s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                badgePulseShadow: {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                        boxShadow: '0 0 0px rgba(196,122,58,0)',
                        borderColor: 'rgba(255,255,255,0.1)'
                    },
                    '50%': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 10px rgba(196,122,58,0.2)',
                        borderColor: 'rgba(255,255,255,0.3)'
                    },
                },
                textGlowBreath: {
                    '0%, 100%': {
                        opacity: '0.9',
                        textShadow: '0 2px 10px rgba(0,0,0,0.8)'
                    },
                    '50%': {
                        opacity: '1',
                        textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 15px rgba(255,255,255,0.15)'
                    },
                },
                emberFlicker: {
                    '0%, 100%': {
                        color: '#FFE5B4',
                        textShadow: '0 0 4px rgba(196,122,58,0.5)'
                    },
                    '50%': {
                        color: '#fbbf24',
                        textShadow: '0 0 20px rgba(196,122,58,0.8), 0 0 10px rgba(255,255,255,0.6)'
                    },
                },
                premiumShimmer: {
                    '0%': { backgroundPosition: '200% center' },
                    '100%': { backgroundPosition: '-200% center' },
                },
                heroDrift: {
                    '0%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1.15)' }
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' }
                }
            }
        }
    },
    plugins: [],
}
