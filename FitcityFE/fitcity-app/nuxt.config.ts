import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/scss/main.scss'],

  alias: {
    '@': resolve(__dirname, './'),
    '~': resolve(__dirname, './'),
    '@buro/gl/components': resolve(__dirname, './buroGL/components'),
    '@buro/gl': resolve(__dirname, './buroGL/index.js'),
    '~~': resolve(__dirname, './'),
    '@/phive-studio': resolve(__dirname, './phive-studio')
  },

  components: [
    {
      path: '~/components/core',
      extensions: ['vue'],
      pathPrefix: false,
    },
    {
      path: '~/components',
      extensions: ['vue'],
      pathPrefix: true, // This will prefix other components to avoid conflicts
      ignore: ['core/**']
    },
  ],

  plugins: [
    '~/plugins/viewport.js',
    '~/plugins/gsap-plugins.client.js'
  ],

  modules: ['@pinia/nuxt', '@nuxt/image'],

  runtimeConfig: {
    public: {
      paths: ['/'],
      audio: []
    }
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Kolker+Brush&display=swap' }
      ]
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "sass:math"; @import "~/assets/scss/_mixins.scss";'
        }
      }
    }
  }
})
