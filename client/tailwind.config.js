/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'index.html',
    './app/**/*.html',
    './app/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        'red-cus': '#f7434c',
        'category': '#f7464c',
        'btn': '#f84c4c',
        'phone': '#ff6600',
        'orange-cus': '#ff8949',
        'login-left': '#EDF1F4',
        'login-right': '#C3CBDC',
        'signup-left': '#FF5F6D',
        'signup-right': '#FFC371',
      },
    },
  },
  plugins: [],
}

