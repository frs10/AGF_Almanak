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
          blue: '#1a2d5a',
          'blue-dark': '#0f1d3d',
          'blue-light': '#2a4a8a',
        },
      },
    },
  },
  plugins: [],
}
export default config
