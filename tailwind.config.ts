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
          blue: 'var(--agf-blue)',
          'blue-dark': 'var(--agf-blue-dark)',
          'blue-light': 'var(--agf-blue-light)',
          gold: 'var(--agf-gold)',
          'gold-dark': 'var(--agf-gold-dark)',
          'gold-light': 'var(--agf-gold-light)',
          'off-white': 'var(--agf-off-white)',
          error: 'var(--agf-error)',
        },
      },
      fontFamily: {
        display: ['var(--font-montserrat)', 'sans-serif'],
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        fraktur: ['var(--font-unifraktur)', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
