/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './public/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        ink: '#2d2438',
        plum: '#3f3157',
        muted: '#6b6478',
        soft: '#8a8398',
        line: '#ece7f3',
        hero: '#7f639e',
        night: '#2b2438',
        rose: '#c08497',
        sage: '#8fa98f',
        star: '#e0a55e',
        lav: {
          50: '#f7f4fb',
          100: '#efe8f7',
          200: '#e8e3f0',
          400: '#9c86bd',
          DEFAULT: '#7b5ea7',
          600: '#6d5196',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'system-ui', 'sans-serif'],
        display: ['Manrope', '"Noto Sans"', 'sans-serif'],
        script: ['"Marck Script"', 'cursive'],
      },
      maxWidth: { container: '1232px' },
      boxShadow: {
        card: '0 12px 32px -12px rgba(63, 49, 87, 0.18)',
        float: '0 10px 30px -8px rgba(43, 36, 56, 0.35)',
      },
    },
  },
  plugins: [],
};
