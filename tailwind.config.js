const colors = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      background: '#161616',
      background2: '#303030',
      background3: '#1e1d1d',
      primary: '#1D263D',
      highlight: 'rgb(71, 247, 34)',
      positive: colors.green['500'],
      warning: 'rgb(146, 131, 55)',
      negative: colors.red['500']
    }
  },
  plugins: []
}
