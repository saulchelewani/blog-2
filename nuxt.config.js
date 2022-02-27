import getSiteMeta from './utils/getSiteMeta'

const meta = getSiteMeta()

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: true,
  target: 'static',

  server: {
    host: process.env.HOST,
    port: process.env.PORT
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    script: [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-2RQQZS4PHL',
        async: true
      }
    ],
    htmlAttrs: {
      lang: 'en-US'
    },
    title: 'Chelewani - We spread the solutions [...]',
    meta: [
      ...meta,
      { charset: 'utf-8' },
      { name: 'HandheldFriendly', content: 'True' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:site_name', content: 'Chelewani' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Coding and application architectural solutions. We spread the solutions like [...]. '
      },
      { property: 'og:image:width', content: '740' },
      { property: 'og:image:height', content: '300' },
      { name: 'twitter:site', content: '@kamlfuz' },
      { name: 'twitter:card', content: 'summary_large_image' }
    ],
    link: [
      // { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      {
        hid: 'canonical',
        rel: 'canonical',
        href: process.env.BASE_URL
      },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400&display=swap&family=DM+Mono&display=swap' }

    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/postcss8',
    '@nuxtjs/moment'
  ],


  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/content
    '@nuxt/content'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-atom-dark.css'
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {}
      }
    }
  },

  baseUrl: process.env.BASE_URL
}
