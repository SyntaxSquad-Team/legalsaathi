/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#EBF2FC",
          100: "#C5D8F4",
          200: "#8BBDE0",
          500: "#1A56A0",
          600: "#154888",
          700: "#0F3D7A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
