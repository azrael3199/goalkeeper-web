/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#cef2f9',
          200: '#9ee6f2',
          300: '#6dd9ec',
          400: '#3dcde5',
          500: '#0cc0df',
          600: '#0a9ab2',
          700: '#077386',
          800: '#054d59',
          900: '#02262d',
        },
        secondary: {
          100: '#ccdee9',
          200: '#99bdd3',
          300: '#669dbd',
          400: '#337ca7',
          500: '#005b91',
          600: '#004974',
          700: '#003757',
          800: '#00243a',
          900: '#00121d',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fade-in 2s ease-out',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
