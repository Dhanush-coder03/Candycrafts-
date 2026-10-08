/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F5EFEB',
          300: '#EAE2D8',
          400: '#DCD1C3',
          500: '#C8B9A6',
        },
        terracotta: {
          50: '#FDF6F3',
          100: '#F8E7E0',
          200: '#F0C9BA',
          300: '#E4A590',
          400: '#D57F61',
          500: '#C25D3B',
          600: '#A94B2C',
          700: '#8A3B22',
        },
        rosewood: {
          50: '#FAF4F4',
          100: '#F3E4E4',
          200: '#E4C2C3',
          300: '#D29C9E',
          400: '#BD7578',
          500: '#A45357',
        },
        walnut: {
          50: '#F7F6F5',
          100: '#ECE8E5',
          200: '#D8D1CB',
          300: '#BCB1A8',
          400: '#998B80',
          500: '#75665C',
          600: '#5A4C43',
          700: '#433730',
          800: '#2F2621',
          900: '#1F1814',
        },
        sage: {
          50: '#F6F8F5',
          100: '#E7EDE4',
          200: '#CCD8C6',
          300: '#A9BDA2',
          400: '#849E7C',
          500: '#647D5C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(47, 38, 33, 0.05)',
        'soft-md': '0 8px 30px -4px rgba(47, 38, 33, 0.08)',
        'soft-lg': '0 16px 40px -6px rgba(47, 38, 33, 0.12)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(47, 38, 33, 0.04)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
