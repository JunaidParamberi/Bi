
/** @type {import('tailwindcss').Config} */
import lineClamp from '@tailwindcss/line-clamp';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'border-spin': {
          '100%': {
            transform: 'rotate(-360deg)',
          },
        },
      },
      animation: {
        'border-spin': 'border-spin 6s linear infinite',
      },
      colors: {
        'accent-green': '#00e47c',
        'dark-green': '#08312a',
        'warm-gray': '#e5e3de',
        'light-gray': '#f6f5f3',
      },
    },
    screens: {
      'sm': '640px',
      'md': '901px',
      'lg': '1024px',
      'xl': '3040px',
      'max-md': { 'max': '900px' }, 
      'max-lg': { 'max': '1023px' }, 
      'max-xl': { 'max': '1279px' }, 
    }
  },
  plugins: [
    lineClamp
  ],
};