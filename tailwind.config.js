import flowbitePlugin from 'flowbite/plugin';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js", // Incluye Flowbite
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [flowbitePlugin], // Añade el plugin de Flowbite
};
