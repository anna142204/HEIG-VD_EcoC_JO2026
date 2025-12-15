// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    '~/assets/css/variables.css' 
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    ['@nuxt/icon', {
        mode: 'svg', 
        serverBundle: {
          collections: ['lucide']
        }
    }],
    ['@nuxt/image', {
        format: ['webp'],
        quality: 80,
    }],
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})