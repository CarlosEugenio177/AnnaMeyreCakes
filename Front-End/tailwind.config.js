/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base
        cream: '#FBF7F2',
        petal: '#FBF7F2',
        surface: '#FFFFFF',
        blush: '#F7ECE7',
        line: '#EEE2DA',
        // Texto
        cocoa: '#4A2C23',
        roseText: '#4A2C23',
        muted: '#8F766B',
        softGray: '#8F766B',
        // Marca
        brand: '#D72651',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(74, 44, 35, 0.04), 0 8px 24px rgba(74, 44, 35, 0.06)',
        button: '0 8px 20px rgba(215, 38, 81, 0.22)',
      },
    },
  },
  plugins: [],
};
