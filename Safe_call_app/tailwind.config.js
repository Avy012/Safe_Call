/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        secondary: '#000000',
        light: {
          100: '#88b3eb',
          200: '#A8D5DB',
          300: '#9CA4AB',
        },
        dark:{
          100: '#221f3d',
          200: '#0f0d23',
        },
        accent: '#AB8BFF'
      }
    },
  },
  plugins: [],
}
