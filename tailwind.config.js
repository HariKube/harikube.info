/** @type {import('tailwindcss').Config} */
const indigo = {
    50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
    400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
    800: '#3730a3', 900: '#312e81', 950: '#1e1b4b',
};

module.exports = {
    presets: [require('./themes/hugo-saasify-theme/tailwind.config.js')],
    content: [
      "./themes/hugo-saasify-theme/layouts/**/*.html",
      "./layouts/**/*.html",
      "./content/**/*.{html,md}"
    ],
    theme: {
      extend: {
        colors: {
          primary: indigo,
          secondary: indigo,
          gray: {
            50: '#f7f9fc', 100: '#eef2f6', 200: '#dce3ed', 300: '#cbd5e1',
            400: '#94a3b8', 500: '#64748b', 600: '#526176', 700: '#475569',
            800: '#2e2a56', 900: '#1e1b4b', 950: '#14112e',
          },
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          heading: ['Plus Jakarta Sans', 'sans-serif'],
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/typography'),
    ],
  }