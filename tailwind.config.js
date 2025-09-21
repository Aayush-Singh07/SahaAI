/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy-blue': '#1A2B4C',
        'bright-yellow': '#FFD700',
      },
    },
  },
  plugins: [],
};
