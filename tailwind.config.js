/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ferrari: {
          red: '#E10600',
          'red-dark': '#B00500',
          'red-light': '#FF1A1A',
          black: '#0A0A0A',
          'black-soft': '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Archivo Black', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
