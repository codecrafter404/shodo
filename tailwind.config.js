/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        "primary": {
          'font': 'var(--primary-font-color)',
          'background': 'var(--primary-background-color)',
          'accent': 'var(--primary-accent-color)',

        },
        "secondary": {
          'font': 'var(--secondary-font-color)',
          'background': 'var(--secondary-background-color)',
          'accent': 'var(--secondary-accent-color)',
        }
      }
    },
    theme: {

    }
  },
  plugins: [],
}

