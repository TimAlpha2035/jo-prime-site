/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        'jp-blue':    '#1B4F72',
        'jp-cyan':    '#1ABCE8',
        'jp-graphite':'#1C2833',
        'jp-blue2':   '#2471A3',
        'jp-cyan-l':  '#AED6F1',
        'jp-gray':    '#D5D8DC',
        'jp-gray2':   '#7F8C8D',
      },
      fontFamily: {
        'nunito': ['"Nunito Sans"', 'sans-serif'],
        'roboto': ['"Roboto Slab"', 'serif'],
      },
    },
  },
  plugins: [],
}