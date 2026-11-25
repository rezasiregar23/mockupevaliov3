// Shared Tailwind (CDN) theme for all EVALIO pages — tokens taken from the Figma file.
tailwind.config = {
  theme: {
    extend: {
      fontFamily: { sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      // Figma text uses "normal" line height unless stated otherwise.
      fontSize: {
        xs: ['12px', 'normal'],
        sm: ['14px', 'normal'],
        base: ['16px', 'normal'],
        '2xl': ['24px', 'normal'],
        '4xl': ['36px', 'normal'],
      },
      colors: {
        page: '#f3f9fd',
        line: '#dceaf4',
        sky: { 50: '#e8f6fd', 75: '#e5f5fd', 100: '#d3eefb', 150: '#bde4f6', 200: '#c6e7f7', 300: '#a9d6f0' },
        mist: { 50: '#e7f0f9', 300: '#bcd3e8' },
        brand: { DEFAULT: '#0957c3', light: '#2a8fc7' },
        ink: { DEFAULT: '#0b2a5b', strong: '#0a1f44', body: '#4c6589', muted: '#86a0be' },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(10,31,69,0.04)',
        'card-hover': '0 1px 2px 0 rgba(10,31,69,0.04), 0 10px 30px 0 rgba(10,31,69,0.08)',
        search: '0 1px 2px 0 rgba(10,31,69,0.04), 0 10px 30px 0 rgba(10,31,69,0.08)',
        'search-sm': '0 8px 24px 0 rgba(10,31,69,0.06)',
        feature: '0 10px 24px 0 rgba(10,31,69,0.08)',
        pop: '0 1px 2px 0 rgba(10,31,69,0.04), 0 16px 40px 0 rgba(10,31,69,0.14)',
      },
      keyframes: {
        'pop-in': { from: { opacity: '0', transform: 'translateY(-4px) scale(0.98)' }, to: { opacity: '1', transform: 'none' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'toast-in': { from: { opacity: '0', transform: 'translate(-50%, 8px)' }, to: { opacity: '1', transform: 'translate(-50%, 0)' } },
      },
      animation: {
        'pop-in': 'pop-in 140ms ease-out',
        'fade-in': 'fade-in 140ms ease-out',
        'toast-in': 'toast-in 180ms ease-out',
      },
    },
  },
};
