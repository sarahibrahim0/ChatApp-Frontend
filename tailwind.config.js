
/** @type {import('tailwindcss').Config} */
module.exports = {

    darkMode: "class", // مهم عشان نتحكم بالدارك مود عن طريق إضافة class="dark"

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
     },
      colors:{
"licorice": "#1B1717ff",
"english-violet": "#5E4B76ff",
"white": "#FFFFFFff",
"white-smoke": "#F4F4F4ff",
"english-violet-2": "#402E58ff",
"french-gray-2": "#C8C7CEff",
"russian-violet": "#35234Eff",
"white-2": "#FFFFFFff",
"mantis": "#79D769ff",
"royal-purple": "#6F46A2ff",
"french-gray" :"#C7C6CDff"
      },
       fontSize: {
        'xxs': '0.625rem', // 10px
      },
    },

          screens: {
      xs: "480px",   // شاشة صغيرة جداً
      sm: "640px",   // small
      md: "768px",   // medium
      lg: "1024px",  // large
      xl: "1280px",  // extra large
      "2xl": "1536px", // double extra large
    },

  },
  plugins: [],
}