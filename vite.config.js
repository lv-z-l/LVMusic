
import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */

const env = loadEnv('development', './')

function createProxyObject() {
  const { VITE_PROXY_PREFIX, VITE_SERVER_URL } = env
  return {
    [`^${VITE_PROXY_PREFIX}.*`]: {
      target: VITE_SERVER_URL,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(VITE_PROXY_PREFIX), '')
    },
  }
}

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
    proxy: createProxyObject()
  }
})
