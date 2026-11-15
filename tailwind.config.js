/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#0b0f19',
          800: '#111827',
          700: '#1f2937',
        },
        cyber: {
          cyan: '#00f0ff',
          amber: '#ffb703',
          red: '#ff0055',
          green: '#00ff88',
        }
      },
      fontFamily: {
        mono: ['Courier New', 'monospace', 'ui-monospace'],
      }
    },
  },
  plugins: [],
}
