/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          10: "#e8e6fa",
          20: "#d9d5f7",
          50: "#8d84d0",
          100: "#7f76cb",
          200: "#7268c5",
          300: "#655ac0",
          400: "#584bba",
          500: "#4F43AF", // <- brand color
          600: "#493ea1",
          700: "#423893",
          800: "#3c3384",
          900: "#352d76",
        },
      },
      backgroundImage: {
        "company-page": "url('./src/Assets/banner1.webp')",
        "about-page": "url('./src/Assets/banner2.webp')",
        "home-page": "url('./src/Assets/banner3.webp')",
      },
      fontFamily: {
        helvetica: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
