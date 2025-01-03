/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#12b886",
          dark: "#099268",
          darker: "#0ca678",
          disabled: "#38d9a9",
        },
        text: {
          DEFAULT: "#fff",
          hover: "#e6f7f1",
          disabled: "#d1d5db",
        },
        iconButton: {
          DEFAULT: "#f0f0f0",
          hover: "#e0e0e0",
          active: "#d0d0d0",
        },
      },
    },
  },
  plugins: [],
};
