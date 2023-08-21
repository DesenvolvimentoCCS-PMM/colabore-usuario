/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        "8xl": "1440px",
      },
      colors: {
        blueCol: "#232C69",
        yellowCol: "#DD9A25",
        purpleCol: "#3B2566",
      },
      fontFamily: {
        sans: "var(--font-poppins)",
      },
    },
  },
  plugins: [],
};
