/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Chocolate (fundos escuros e texto principal)
        choco: '#2A1712',
        cocoa: '#2A1712',
        roseText: '#2A1712',
        // Chantilly (fundo claro)
        cream: '#FFF7EC',
        petal: '#FFF7EC',
        surface: '#FFFFFF',
        line: '#F1E2D0',
        muted: '#8A6F64',
        softGray: '#8A6F64',
        // Morango (acao principal)
        brand: '#DB3A63',
        blush: '#FDE9EE',
        // Manteiga (detalhes)
        butter: '#F7C873',
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 0 rgba(42, 23, 18, 0.04), 0 18px 40px -18px rgba(42, 23, 18, 0.25)',
        button: '0 10px 24px -8px rgba(219, 58, 99, 0.55)',
      },
      keyframes: {
        rise: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        wobble: { '0%,100%': { transform: 'rotate(-2deg)' }, '50%': { transform: 'rotate(2deg)' } },
      },
      animation: {
        rise: 'rise .5s ease-out both',
        wobble: 'wobble 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
