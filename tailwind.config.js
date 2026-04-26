/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#ede4d3',
          300: '#dfd0b8',
        },
        calm: {
          blue: '#4a90b8',
          'blue-light': '#e8f3fb',
          'blue-mid': '#c5dff0',
          green: '#5a9f7a',
          'green-light': '#e8f5ee',
          amber: '#c8922a',
          'amber-light': '#fdf3e0',
          red: '#c0504d',
          'red-light': '#fdecea',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
