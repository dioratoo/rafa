/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./style/**/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Poppins', 'sans-serif']
    },
    extend: {
      backgroundImage: {
        "home": "url('/assets/restaurante/bg.png')"
      }
    },
  },
  plugins: [],
}

