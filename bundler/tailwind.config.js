const defaultTheme = require('tailwindcss/defaultTheme')
const globEntries = require('webpack-glob-entries-extended')

const paths = require("./paths.js")

// NOTE: Required because webpack does not support extended globs
const content = Object.values(globEntries(paths.src + "/**/*.{html,js,jsx,ts,tsx}"))

const fontSizes = {}
const minFontSize = 12
const maxFontSize = 70
let i = minFontSize
while (i <= maxFontSize) {
  fontSizes[i] = `${i / 16}rem`
  i = i + 2
}

module.exports = {
  content: content,
  darkMode: "class",
  theme: {
    fontSize: { ...fontSizes },
    extend: {
      fontFamily: {
        'sans': ['Inter', ...defaultTheme.fontFamily.sans],
        'serif': ['Lora', ...defaultTheme.fontFamily.serif],
        'mono': ['Inconsolata', ...defaultTheme.fontFamily.mono],
      },
      fontWeight: {
        "weight-400": 400,
        "weight-500": 500,
        "weight-700": 700,
      },
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
    },
  },
  plugins: [],
}