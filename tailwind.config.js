/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A84FF',
          dark: '#007AFF',
        },
        secondary: {
          DEFAULT: '#64D2FF',
          dark: '#5AC8FA',
        },
        success: {
          DEFAULT: '#30D158',
          dark: '#34C759',
        },
        danger: {
          DEFAULT: '#FF453A',
          dark: '#FF3B30',
        },
        warning: {
          DEFAULT: '#FF9F0A',
          dark: '#FF9500',
        },
        dark: {
          bg: '#1C1C1E',
          surface: '#2C2C2E',
          border: '#3A3A3C',
          text: '#FFFFFF',
          'text-secondary': '#8E8E93',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
