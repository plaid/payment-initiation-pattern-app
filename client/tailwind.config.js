/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'black-1000': '#111111',
        'dark-gray': 'rgb(75, 75, 75)',
        'plaid-red': '#f44e66',
        'plaid-blue': '#0072cf',
        'plaid-green': '#23d09c',
        'plaid-yellow': '#f5a623',
      },
      fontFamily: {
        sans: ['Cern', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Inconsolata', 'Consolas', 'Courier', 'monospace'],
      },
      borderRadius: {
        threads: '0.2rem',
      },
      boxShadow: {
        threads: '0 0.2rem 0.4rem 0 rgba(17, 17, 17, 0.08)',
      },
    },
  },
  plugins: [],
};
