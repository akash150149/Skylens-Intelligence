/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aviation-black': '#0a0a0a',
        'aviation-slate': '#0f172a',
        'aviation-emerald': '#10b981',
        'vfr-green': '#059669',
        'mvfr-blue': '#2563eb',
        'ifr-red': '#dc2626',
        'lifr-purple': '#9333ea',
      },
      fontFamily: {
        'hud': ['"Share Tech Mono"', 'monospace'],
      },
      boxShadow: {
        'hud-glow': '0 0 15px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
