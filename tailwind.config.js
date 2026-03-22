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
        ios: {
          blue: '#007AFF',
          green: '#34C759',
          indigo: '#5856D6',
          orange: '#FF9500',
          pink: '#FF2D55',
          purple: '#AF52DE',
          red: '#FF3B30',
          teal: '#5AC8FA',
          yellow: '#FFCC00',
          gray: {
            1: '#8E8E93',
            2: '#AEAEB2',
            3: '#C7C7CC',
            4: '#D1D1D6',
            5: '#E5E5EA',
            6: '#F2F2F7',
          },
          dark: {
            1: '#8E8E93',
            2: '#636366',
            3: '#48484A',
            4: '#3A3A3C',
            5: '#2C2C2E',
            6: '#1C1C1E',
          }
        },
        primary: '#007AFF',
        dark: {
          bg: '#000000',
          surface: '#1C1C1E',
          card: '#2C2C2E',
          border: '#38383A',
        }
      },
      borderRadius: {
        'ios-sm': '10px',
        'ios-md': '14px',
        'ios-lg': '20px',
        'ios-xl': '24px',
      },
      boxShadow: {
        'ios': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'ios-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'ios-glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      animation: {
        'ios-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
