/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*",
  ],
  theme: {
    extend: {
      colors: {
        // Custom Dark Theme
        dark: {
          50: '#f0f4f8',   // Lightest background
          100: '#d9e2ec',  // Light background
          200: '#bcccdc',  // Soft gray
          300: '#9fb3c8',  // Medium gray
          400: '#829ab1',  // Darker gray
          500: '#627d98',  // Base gray
          600: '#486581',  // Dark gray
          700: '#334e68',  // Darker gray
          800: '#243b53',  // Very dark gray
          900: '#102a43',  // Darkest background
        },
        // Vibrant Accent Colors
        primary: {
          50: '#e3f2fd',   // Lightest blue
          100: '#bbdefb',  // Light blue
          200: '#64b5f6',  // Bright blue
          300: '#42a5f5',  // Vibrant blue
          400: '#2196f3',  // Strong blue
          500: '#1e88e5',  // Base blue
          600: '#1976d2',  // Dark blue
          700: '#1565c0',  // Darker blue
          800: '#0d47a1',  // Very dark blue
          900: '#0d47a1',  // Darkest blue
        },
        accent: {
          50: '#e8f5e9',   // Lightest green
          100: '#c8e6c9',  // Light green
          200: '#81c784',  // Bright green
          300: '#66bb6a',  // Vibrant green
          400: '#4caf50',  // Strong green
          500: '#43a047',  // Base green
          600: '#388e3c',  // Dark green
          700: '#2e7d32',  // Darker green
          800: '#1b5e20',  // Very dark green
          900: '#1b5e20',  // Darkest green
        },
        // Complementary colors for alerts and states
        success: {
          50: '#e8f5e9',
          100: '#c8e6c9',
          200: '#81c784',
          300: '#66bb6a',
          400: '#4caf50',
          500: '#43a047',
          600: '#388e3c',
          700: '#2e7d32',
          800: '#1b5e20',
          900: '#1b5e20',
        },
        danger: {
          50: '#ffebee',
          100: '#ffcdd2',
          200: '#ef9a9a',
          300: '#e57373',
          400: '#ef5350',
          500: '#f44336',
          600: '#e53935',
          700: '#d32f2f',
          800: '#c62828',
          900: '#b71c1c',
        },
        warning: {
          50: '#fff3e0',
          100: '#ffe0b2',
          200: '#ffcc80',
          300: '#ffb74d',
          400: '#ffa726',
          500: '#ff9800',
          600: '#fb8c00',
          700: '#f57c00',
          800: '#ef6c00',
          900: '#e65100',
        }
      },
      // Custom gradients and transitions
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #1e88e5, #42a5f5)',
        'gradient-accent': 'linear-gradient(to right, #43a047, #66bb6a)',
      },
      // Enhanced shadow and border radius
      boxShadow: {
        'custom-lg': '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'custom-xl': '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        'custom': '0.75rem',  // More pronounced rounded corners
      },
      // Animation and transition
      transitionProperty: {
        'custom': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
      }
    },
  },
  plugins: [],
}

