/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'lc-bg': '#1B1C21',
                'lc-card': '#28292E',
                'lc-border': '#37383C',

                'lc-text': '#FFFFFF',
                'lc-text-muted': '#969699',
                'lc-text-2': '#C8C8C8',

                'lc-gold': '#F0A01A',
                'lc-orange': '#F27536',
                'lc-green': '#3CB44B',
                'lc-blue': '#4E81AF',

                'lc-gray-btn': '#646569',
                'lc-shadow-dark': '#0D0D10'
            },
            boxShadow: {
                'lc-card': '0 10px 30px rgba(13,13,16,0.25)',
            },
            borderRadius: {
                'lc-lg': '1rem',
            }
        },
    },
    plugins: [],
}
