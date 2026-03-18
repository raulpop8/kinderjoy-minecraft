import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mc: {
          bg:       '#0B0D12',
          surface:  '#13161E',
          surface2: '#1C2030',
          border:   '#262B3D',
          text:     '#DDE2F5',
          muted:    '#626B8A',
          green:    '#52A022',
          'green-lit': '#70CE34',
          blue:     '#3ECFCF',
          gold:     '#FFCC00',
          red:      '#DD3333',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        body:  ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
