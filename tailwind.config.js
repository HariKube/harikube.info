/** @type {import('tailwindcss').Config} */
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
          primary: {
            50: '#e6f7ff',
            100: '#b3e5ff',
            200: '#80d4ff',
            300: '#4dc2ff',
            400: '#1ab0ff',
            500: '#00a3ff',
            600: '#0088e6',
            700: '#0066b3',
            800: '#004480',
            900: '#00334d',
          },
          secondary: {
            50: '#f5e6ff',
            100: '#e6b3ff',
            200: '#d680ff',
            300: '#c64dff',
            400: '#b71aff',
            500: '#a700ff',
            600: '#8a00d4',
            700: '#6b00a3',
            800: '#4d0073',
            900: '#2e0042',
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