/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}", // Esto cubre todas tus páginas: Home, List, Panel, etc.
    ],
    theme: {
        extend: {
        colors: {
            // Colores de tu marca
            primary: '#0ABAB5',   // Turquesa
            secondary: '#FAC213', // Amarillo/Oro
        },
        fontFamily: {
            // Configuración para que coincida con Sweet & Coffee
            serif: ['Playfair Display', 'serif'], // Para títulos elegantes
            sans: ['Montserrat', 'sans-serif'],   // Para el cuerpo de texto y botones
        },
        },
    },
    plugins: [],
}