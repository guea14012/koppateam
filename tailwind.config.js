/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        k: {
          bg:      '#070710',
          surface: '#0d0d1a',
          card:    '#111122',
          border:  '#1e1e38',
          hover:   '#1a1a30',
          text:    '#e0e4ff',
          muted:   '#6b7ab5',
          dim:     '#3a4070',
        },
        // App brand colors
        word:  '#0066ff',
        excel: '#00bb44',
        pdf:   '#ff3355',
        point: '#8b2fff',
        bi:    '#ff8800',
        meet:  '#00d4ff',
        mail:  '#ffcc00',
        notes: '#ff66aa',
        board: '#00ff88',
        wall:  '#aa66ff',
        drive: '#66aaff',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
