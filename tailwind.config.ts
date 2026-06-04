import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /* ── 颜色（桥接 CSS 变量） ── */
      colors: {
        'module-current': 'var(--color-module-current-base)',
        'module-current-lightest': 'var(--color-module-current-lightest)',
        'module-current-light': 'var(--color-module-current-light)',
        'module-current-dark': 'var(--color-module-current-dark)',
        'module-current-darkest': 'var(--color-module-current-darkest)',
        'neutral': {
          0: 'var(--color-neutral-0)',
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          150: 'var(--color-neutral-150)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          800: 'var(--color-neutral-800)',
          900: 'var(--color-neutral-900)',
        },
      },
      /* ── 间距 ── */
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '7': 'var(--space-7)',
        '8': 'var(--space-8)',
        '9': 'var(--space-9)',
        '10': 'var(--space-10)',
      },
      /* ── 圆角 ── */
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      /* ── 字体 ── */
      fontFamily: {
        sans: 'var(--font-family-sans)',
        serif: 'var(--font-family-serif)',
        mono: 'var(--font-family-mono)',
      },
      /* ── 字号 ── */
      fontSize: {
        xs: ['var(--text-xs)', { lineHeight: 'var(--leading-xs)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-sm)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-base)' }],
        md: ['var(--text-md)', { lineHeight: 'var(--leading-md)' }],
        lg: ['var(--text-lg)', { lineHeight: 'var(--leading-lg)' }],
        xl: ['var(--text-xl)', { lineHeight: 'var(--leading-xl)' }],
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-2xl)' }],
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-3xl)' }],
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-4xl)' }],
        display: ['var(--text-display)', { lineHeight: 'var(--leading-display)' }],
      },
      /* ── 阴影 ── */
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      /* ── 断点 ── */
      screens: {
        xl: '1280px',
        lg: '1024px',
        md: '768px',
        sm: '0px',
      },
      /* ── 宽度 ── */
      width: {
        'sidebar-expanded': 'var(--sidebar-width-expanded)',
        'sidebar-collapsed': 'var(--sidebar-width-collapsed)',
      },
      /* ── 高度 ── */
      height: {
        'topnav': 'var(--topnav-height)',
      },
      /* ── Z-index ── */
      zIndex: {
        base: '0',
        sticky: '200',
        tooltip: '600',
      },
      /* ── 过渡 ── */
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        module: 'var(--duration-module)',
      },
      transitionTimingFunction: {
        default: 'var(--ease-default)',
      },
    },
  },
  plugins: [],
};

export default config;
