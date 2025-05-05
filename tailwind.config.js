/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3DD598',
          dark: '#2AA876',
        },
        secondary: '#0A1629',
        accent: '#FF575F',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        background: '#F8F9FC',
        textPrimary: '#1A1C1E',
        textSecondary: '#4D5E80',
        textTertiary: '#8A94A6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};