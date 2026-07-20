/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fdf8f0',
          100: '#f9edd8',
          200: '#f3d9a8',
          300: '#ebc478',
          400: '#e0ac48',
          500: '#d4a017',
          600: '#b88913',
          700: '#9c7210',
          800: '#805b0d',
          900: '#64440a',
        },
        cream: {
          50: '#fefdfb',
          100: '#fcf9f3',
          200: '#f9f4e8',
          300: '#f5ecd9',
          400: '#f0e3c8',
          500: '#ead8b3',
          600: '#c8b898',
          700: '#a6987d',
          800: '#847862',
          900: '#625847',
        },
        espresso: {
          50: '#f5f3f1',
          100: '#e8e3de',
          200: '#d1c9c0',
          300: '#baafa2',
          400: '#a39584',
          500: '#8c7b66',
          600: '#706252',
          700: '#54493e',
          800: '#38302a',
          900: '#1c1716',
          950: '#0e0b0a',
        },
        sand: {
          100: '#f9f4e8',
        },
      },
      fontFamily: {
        heading: ['Cairo', 'system-ui', 'sans-serif'],
        body: ['Tajawal', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
