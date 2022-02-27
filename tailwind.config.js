module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Merriweather', 'Georgia'],
        'mono': ['DM Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
