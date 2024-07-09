import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@store': fileURLToPath(new URL('./src/store/', import.meta.url)),
      '@router': fileURLToPath(new URL('./src/router/', import.meta.url)),
      '@images': fileURLToPath(new URL('./src/assets/images/', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/assets/styles/', import.meta.url)),
      '@componentes': fileURLToPath(new URL('./src/components/', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views/', import.meta.url)),
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
