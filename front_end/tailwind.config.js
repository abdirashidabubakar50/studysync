/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#A06CD5',
        secondary: "#102B3F",
        accent: "#6247AA",
        neutral: "#062726",
        background: "#E2CFEA",
      },
    },
  },
  plugins: [],
};
