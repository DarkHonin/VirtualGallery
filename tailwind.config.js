const colors = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      background: '#161616',
      background2: '#303030',
      primary: '#1D263D',
      positive: colors.green['500'],
      negative: colors.red['500']
    }
  },
  plugins: []
}
