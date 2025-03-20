import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    proxy: {
      '/attachments': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
