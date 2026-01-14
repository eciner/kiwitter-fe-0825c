/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#121054',
        accent: '#1a1670',
        dark: '#0a0830',
      },
      fontFamily: {
        'display': ['Kite One', 'cursive'],
        'heading': ['Domine', 'serif'],
        'body': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
