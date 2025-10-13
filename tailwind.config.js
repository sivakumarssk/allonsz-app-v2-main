/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montmedium: ["Montserrat-Medium", "sans-serif"],
        montregular: ["Montserrat-Regular", "sans-serif"],
        Gill: ["Gill-sans-MT", "sans-serif"],
        popmedium: ["Poppins-Medium", "sans-serif"],
        popregular: ["Poppins-Regular", "sans-serif"],
      },
      colors: {
        primary: "#44689C",
        ripple: "#3d5d8c",
        formText: "#4F4F4F",
        resend: "#B6B6B6",
        chckbox: "#8E8E93",
        bigText: "#002B39",
        smallText: "#7D848D",
        backButton: "#C7F1FF",
      },
    },
  },
  plugins: [],
};
