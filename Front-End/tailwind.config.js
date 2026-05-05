/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF8F5',
        surface: '#FFFCFA',
        brand: '#E61E4D',
        blush: '#F9ECE9',
        petal: '#FBF8F5',
        roseText: '#8A4B3E',
        softGray: '#A98F87',
        muted: '#A98F87',
        cocoa: '#8A4B3E',
        line: '#EADDD7',
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 16px 35px rgba(138, 75, 62, 0.08)',
        button: '0 18px 32px rgba(230, 30, 77, 0.24)',
      },
    },
  },
  plugins: [],
};
