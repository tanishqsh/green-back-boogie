module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxWidth: {
        200: '200px',
      },
      fontFamily: {
        inter: ['Inter, sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
