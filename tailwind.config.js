/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          base: '#2563EB',
          hover: '#1D4ED8',
          subtle: '#EFF6FF',
        },
        accent: {
          base: '#F59E0B',
          hover: '#D97706',
          subtle: '#FEF3C7',
        },
        neutral: {
          50: '#F8FAFC',
          200: '#E2E8F0',
          500: '#64748B',
          700: '#334155',
          900: '#0F172A',
        },
        semantic: {
          success: { base: '#10B981', subtle: '#ECFDF5', border: '#D1FAE5' },
          warning: { base: '#F59E0B', subtle: '#FFFBEB', border: '#FEF3C7' },
          error: { base: '#F43F5E', subtle: '#FFF1F2', border: '#FECDD3' },
          info: { base: '#06B6D4', subtle: '#ECFEFF', border: '#CFFAFE' },
        },
        surface: '#FFFFFF',
        // Legacy colors to maintain compatibility if they are used elsewhere
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          hover: '#334155',
          border: '#475569',
        }
      },
      fontSize: {
        'display': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h3': ['18px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'base': '6px',
        'md': '8px',
        'lg': '12px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'base': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'md': '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
        'lg': '0 20px 25px -5px rgba(15, 23, 42, 0.15)',
      }
    },
  },
  plugins: [],
}
