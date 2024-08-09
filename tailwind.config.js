const colors = require('tailwindcss/colors')
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    colors: {
      'label-primary': '#FFFFFF',
      'input-primary': '#000000',
      primary: colors.gray[900],
      accent: colors.blue[900],
      'primary-active': colors.slate[500],
      'primary-hover': colors.slate[700],
      'primary-disabled': colors.zinc[900],
      'button-primary': colors.zinc[600],
      'button-positive': colors.emerald[300],
      'button-negative': colors.red[700],
      'button-border': colors.emerald[300]
    }
  },
  plugins: []
}
