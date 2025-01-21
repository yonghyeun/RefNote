/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          light: "#fff",
          dark: "#121212",
          hover: {
            light: "#f0f0f0",
            dark: "#4a4a4a",
          },
          active: {
            light: "#e0e0e0",
            dark: "#3a3a3a",
          },
        },
        primary: {
          DEFAULT: "#12b886",
          dark: "#099268",
          darker: "#0ca678",
          disabled: "#38d9a9",
        },
        danger: {
          DEFAULT: "#f44336",
          hover: "#d32f2f",
          active: "#b71c1c",
          disabled: "#9b1a1a",
        },
        text: {
          DEFAULT: "#fff",
          secondary: "#a0a0a0",
          light: "#121212",
          dark: "#f0f0f0",
          hover: "#e6f7f1",
          disabled: "#d1d5db",
        },
        iconButton: {
          DEFAULT: "#f0f0f0",
          hover: "#e0e0e0",
          active: "#d0d0d0",
        },
        border: {
          light: "#d1d6db",
          dark: "#a0a0a0",
        },
      },
    },
  },
  plugins: [],
};
