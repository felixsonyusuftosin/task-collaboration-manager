/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7fb',
          100: '#e8eef8',
          200: '#d2def1',
          300: '#adc3e5',
          400: '#809fd5',
          500: '#5f82c8',
          600: '#4868b0',
          700: '#3c538f',
          800: '#364776',
          900: '#313e62',
        },
      },
      boxShadow: {
        panel: '0 14px 40px rgba(37, 61, 97, 0.12)',
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
