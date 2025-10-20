import defaultTheme from 'tailwindcss/defaultTheme'

const withOpacity = (variable) => `oklch(var(${variable}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [...defaultTheme.fontFamily.sans],
        display: ['"Segoe UI Variable"', '"Segoe UI"', '"Helvetica Neue"', 'Arial', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        surface: {
          ground: withOpacity('--nc-surface-ground'),
          base: withOpacity('--nc-surface-base'),
          raised: withOpacity('--nc-surface-raised'),
          floating: withOpacity('--nc-surface-floating'),
        },
        accent: {
          DEFAULT: withOpacity('--nc-accent'),
          soft: withOpacity('--nc-accent-soft'),
          strong: withOpacity('--nc-accent-strong'),
          ring: withOpacity('--nc-accent-ring'),
        },
        neutral: {
          950: withOpacity('--nc-ink-strong'),
          700: withOpacity('--nc-ink'),
          500: withOpacity('--nc-ink-soft'),
          300: withOpacity('--nc-ink-subtle'),
        },
        success: {
          DEFAULT: withOpacity('--nc-success'),
          soft: withOpacity('--nc-success-soft'),
        },
        warning: {
          DEFAULT: withOpacity('--nc-warning'),
          soft: withOpacity('--nc-warning-soft'),
        },
        danger: {
          DEFAULT: withOpacity('--nc-danger'),
          soft: withOpacity('--nc-danger-soft'),
        },
        border: {
          subtle: withOpacity('--nc-border-subtle'),
          DEFAULT: withOpacity('--nc-border-base'),
          strong: withOpacity('--nc-border-strong'),
        },
      },
      boxShadow: {
        sunken:
          'inset 0 1px 1px rgba(255,255,255,0.1), 0 1px 2px rgba(15,23,42,0.08)',
        raised:
          'inset 0 1px 0 rgba(255,255,255,0.12), 0 2px 6px rgba(15,23,42,0.1)',
        floating:
          'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 14px rgba(15,23,42,0.12)',
      },
      borderRadius: {
        xl: '14px',
        '2xl': '18px',
        '3xl': '22px',
      },
    },
  },
  plugins: [],
}
