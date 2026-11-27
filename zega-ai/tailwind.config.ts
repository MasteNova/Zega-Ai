import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: '#193C32', 700: '#122E26', 600: '#1F4A3E', 100: '#DCE7E2' },
        ivory: { DEFAULT: '#F5F0E5', dark: '#EDE6D6' },
        terra: { DEFAULT: '#B96F46', 700: '#9C5A36', 100: '#F3E2D7' },
        gold: { DEFAULT: '#D7B56D', 100: '#F4EAD5' },
        ink: '#22271F'
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Ethiopic', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Noto Sans Ethiopic', 'serif']
      },
      boxShadow: { card: '0 1px 3px rgba(25,60,50,.08), 0 4px 16px rgba(25,60,50,.06)' }
    }
  },
  plugins: []
} satisfies Config;
