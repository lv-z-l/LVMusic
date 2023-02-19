
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [
    uni(),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/style/var.scss";'
      }
    }
  },
  server: {
    proxy: {
      '^/wangyiyun/.*': {
        target: 'https://p2.music.126.net',
        changeOrigin: true,
        rewrite: path => path.replace(/\/wangyiyun/, '')
      }
    }
  }
})
