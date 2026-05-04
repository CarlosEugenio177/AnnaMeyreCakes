/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F0C8',
        brand: '#E2292F',
        blush: '#FBE0DC',
        petal: '#FFF6F1',
        roseText: '#C94C55',
        softGray: '#8F8585',
        cocoa: '#8B553C',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 14px 30px rgba(226, 41, 47, 0.12)',
        button: '0 14px 20px rgba(226, 41, 47, 0.22)',
      },
    },
  },
  plugins: [],
};
