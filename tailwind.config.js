module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB",
          dark: "#111827",
          gray: "#6B7280",
        },
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
}
