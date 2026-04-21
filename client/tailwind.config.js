/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'black-1000': '#111111',
        'dark-gray': 'rgb(75, 75, 75)',
        'red-800': '#f44e66',
        'blue-900': '#0072cf',
        'green-600': '#23d09c',
        'yellow-500': '#f5a623',
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
