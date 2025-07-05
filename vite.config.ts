import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 將開頭為 /api 的請求，代理到 OpenStreetMap 伺服器
      '/api': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true, // 必須設為 true，才會正確代理
        rewrite: (path) => path.replace(/^\/api/, ''), // 將路徑中的 /api 去掉再發送
      },
    },
  },
})