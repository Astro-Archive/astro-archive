/** @type {import('tailwindcss').Config} */

// Paleta y escala tipográfica del Sci-fi UI Kit (Free)
// Figma: PEse2mXAsE9al2kYhm4hzF — páginas "Colors palette" (1:5),
// "Typography" (1:11) y "Spacing system" (1:13)
const sfPalette = {
  primary: {
    50: '#FAEBEB',
    100: '#EFC0C0',
    200: '#E7A2A2',
    300: '#DB7878',
    400: '#D55D5D',
    500: '#CA3535',
    600: '#B83030',
    700: '#8F2626',
    800: '#6F1D1D',
    900: '#551616',
  },
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  warning: {
    100: '#FFF4CC',
    300: '#FFD966',
    500: '#FFB800',
    700: '#B85C00',
    900: '#332100',
  },
  error: {
    100: '#FFD6E6',
    300: '#FF4D80',
    500: '#E6004C',
    700: '#7D0036',
    900: '#330014',
  },
  success: {
    100: '#E0FFD9',
    300: '#8CFF66',
    500: '#39FF14',
    700: '#1E6600',
    900: '#0D2600',
  },
  info: {
    100: '#D6FFFF',
    300: '#66FFFF',
    500: '#00FFFF',
    700: '#003366',
    900: '#001933',
  },
  violet: {
    100: '#F2E0FF',
    300: '#D580FF',
    500: '#A020F0',
    700: '#4D0080',
    900: '#1A0026',
  },
};

export default {
  content: [
    "./index.html",
    "./kit.html",
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
        },
        sf: sfPalette,
      },
      fontFamily: {
        mono: ['Courier New', 'monospace', 'ui-monospace'],
        // El kit usa Nippo para títulos y Exo 2 para UI/texto
        display: ['Nippo', 'Chakra Petch', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        ui: ['Exo 2', 'Chakra Petch', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'sf-h1': ['96px', { lineHeight: '110px', letterSpacing: '0.04em' }],
        'sf-h2': ['60px', { lineHeight: '67.5px' }],
        'sf-h3': ['48px', { lineHeight: '54px' }],
        'sf-h4': ['34px', { lineHeight: '38.25px' }],
        'sf-h5': ['24px', { lineHeight: '27px' }],
        'sf-h6': ['20px', { lineHeight: '30px' }],
        'sf-subtitle-1': ['16px', { lineHeight: '24px' }],
        'sf-subtitle-2': ['14px', { lineHeight: '20px', letterSpacing: '0.02em' }],
        'sf-body-1': ['16px', { lineHeight: '24px' }],
        'sf-body-2': ['14px', { lineHeight: '20px' }],
        'sf-button-1': ['16px', { lineHeight: '24px', letterSpacing: '0.0125em' }],
        'sf-button-2': ['14px', { lineHeight: '20px', letterSpacing: '0.0125em' }],
        'sf-caption': ['12px', { lineHeight: '16px', letterSpacing: '0.04em' }],
      },
      spacing: {
        // spacing-0 … spacing-13 del kit
        'sf-0': '0px',
        'sf-1': '2px',
        'sf-2': '4px',
        'sf-3': '8px',
        'sf-4': '12px',
        'sf-5': '16px',
        'sf-6': '24px',
        'sf-7': '32px',
        'sf-8': '40px',
        'sf-9': '48px',
        'sf-10': '64px',
        'sf-11': '80px',
        'sf-12': '96px',
        'sf-13': '160px',
      },
    },
  },
  plugins: [],
}
