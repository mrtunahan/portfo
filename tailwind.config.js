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
        accent: '#1043A8',
        accentHover: '#002F8D',
        accentActive: '#00226C',
        accentOn: '#EEF2F9',
        accentRing: '#2A58B2',
        accentSoft: '#E8F1FF',
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
