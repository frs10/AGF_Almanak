import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        agf: {
          blue: 'rgb(15, 29, 61)',
          'blue-dark': 'rgb(15, 29, 61)',
          'blue-light': '#2a4a8a',
          gold: '#C9A227',
          'gold-dark': '#A68620',
          'gold-light': '#D4B84A',
        },
      },
      fontFamily: {
        display: ['var(--font-cinzel)', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
