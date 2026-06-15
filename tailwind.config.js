/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        matcha: {
          ink: '#1f3128',
          deep: '#37553f',
          leaf: '#7da768',
          sage: '#a3b88c',
          foam: '#d8e7b6',
          cream: '#f4f0e6',
          paper: '#fbfaf4',
          clay: '#b48b70',
          stone: '#8a7e72',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        soft: '0 24px 80px rgba(53, 73, 56, 0.11)',
        glass: '0 8px 32px rgba(53, 73, 56, 0.06), inset 0 1px 0 rgba(255,255,255,0.4)',
        elevated: '0 32px 64px rgba(31, 49, 40, 0.14), 0 8px 16px rgba(31, 49, 40, 0.06)',
      },
    },
  },
  plugins: [],
};
