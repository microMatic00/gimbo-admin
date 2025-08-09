/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF5A1F", // naranja
          dark: "#C2410C",
          light: "#FFEDD5",
        },
        secondary: {
          DEFAULT: "#10B981", // verde
          dark: "#059669",
          light: "#D1FAE5",
        },
        dark: {
          DEFAULT: "#1F2937", // oscuro principal
          light: "#374151",
          lighter: "#4B5563",
        },
        light: {
          DEFAULT: "#F9FAFB", // claro principal
          dark: "#E5E7EB",
          darker: "#9CA3AF",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      boxShadow: {
        card: "0 2px 6px rgba(0, 0, 0, 0.08)",
        dropdown:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        modal:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};
