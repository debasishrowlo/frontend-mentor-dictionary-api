const defaultTheme = require('tailwindcss/defaultTheme')
const globEntries = require('webpack-glob-entries-extended')

const paths = require("./paths.js")

const fontSize = {}
const minFontSize = 12
const maxFontSize = 70
const base = 16
let i = minFontSize
while (i <= maxFontSize) {
  fontSize[i] = `${i / base}rem`
  i += 2
}

const borderRadius = [0, 2, 4, 6, 8, 12, 16, 24].reduce((acc, cur) => {
  acc[cur] = `${cur / base}rem`
  return acc
}, {})
borderRadius["full"] = "9999px"

module.exports = {
  content: Object.values(globEntries(paths.src + "/**/*.{html,js,jsx,ts,tsx}")),
  darkMode: "class",
  theme: {
    extend: {
      borderRadius,
      colors: {
        "purple": "#A445ED",
        "red": "#FF5252",
        "gray": {
          100: "#F4F4F4",
          200: "#E9E9E9",
          300: "#757575",
          400: "#3A3A3A",
          500: "#2D2D2D",
          600: "#1F1F1F",
        },
        "black": "#050505",
        "white": "#FFFFFF",
      },
      fontFamily: {
        'sans': ['Inter', ...defaultTheme.fontFamily.sans],
        'serif': ['Lora', ...defaultTheme.fontFamily.serif],
        'mono': ['Inconsolata', ...defaultTheme.fontFamily.mono],
      },
      fontSize,
    },
  },
  plugins: [],
}