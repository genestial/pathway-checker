/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'in-progress': 'var(--in-progress, #D3D3D3)',
        'leading': 'var(--leading, #00CC00)',
        'advancing': 'var(--advancing, #90EE90)',
        'developing': 'var(--developing, #FFA500)',
        'needs-improvement': 'var(--needs-improvement, #FF0000)',
        'pathway-primary': 'var(--pathway-primary, #119046)',
        'pathway-secondary': 'var(--pathway-secondary, #a7dbda)',
        'pathway-light': 'var(--pathway-light, #e7f4f2)',
        'pathway-dark': 'var(--pathway-dark, #0a5f2d)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};