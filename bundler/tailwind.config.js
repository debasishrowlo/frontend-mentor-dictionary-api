const defaultTheme = require('tailwindcss/defaultTheme')
const globEntries = require('webpack-glob-entries-extended')

const paths = require("./paths.js")

// NOTE: Required because webpack does not support extended globs
const content = Object.values(globEntries(paths.src + "/**/*.{html,js,jsx,ts,tsx}"))

const fontSizes = {}
const minFontSize = 12
const maxFontSize = 50
let i = minFontSize
while (i <= maxFontSize) {
  fontSizes[i] = `${i / 16}rem`
  i = i + 2
}

module.exports = {
  content: content,
  theme: {
    fontSize: { ...fontSizes },
    extend: {
      fontFamily: {
        'sans': ['inter', ...defaultTheme.fontFamily.sans],
        'serif': ['lora', ...defaultTheme.fontFamily.serif],
        'mono': ['inconsolata', ...defaultTheme.fontFamily.mono],
      },
      fontWeight: {
        "weight-400": 400,
        "weight-500": 500,
        "weight-700": 700,
      },
      colors: {
        "light-grayish-blue": "#c3c4ef",
        "grayish-blue": "#67727e",

        "moderate-blue": "#5457b6",
        "dark-blue": "#324152",

        "pale-red": "	#ffb8bb",
        "soft-red": "	#ed6468",

        "very-light-gray": "#f5f6fa",
        "light-gray": "#eaecf1",

        "black": "#2D2D2D",
        "white": "#ffffff",
      },
    },
  },
  plugins: [],
}