/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAFAF8',
        ink: '#141519',
        mute: '#6E6F76',
        rule: '#DEDDD6',
        accent: '#1F3CF0',
        accentSoft: '#E6E9FE',
      },
      fontFamily: {
        sans: ['Archivo Variable', 'Archivo', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      maxWidth: {
        measure: '64ch',
      },
    },
  },
  plugins: [],
};
