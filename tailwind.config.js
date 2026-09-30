/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0D2A5C',
          'navy-dark': '#071633',
          'navy-light': '#143d85',
          blue: '#1F5FD6',
          'blue-light': '#3b82f6',
          'blue-soft': '#EBF3FE',
          amber: '#F59E0B',
          'amber-light': '#FEF3C7',
          'amber-dark': '#B45309',
          emerald: '#10B981',
          'emerald-light': '#D1FAE5',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(13, 42, 92, 0.08), 0 2px 6px -1px rgba(13, 42, 92, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(13, 42, 92, 0.12), 0 4px 10px -2px rgba(13, 42, 92, 0.06)',
        'glow-blue': '0 0 25px rgba(31, 95, 214, 0.35)',
        'glow-amber': '0 0 25px rgba(245, 158, 11, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
