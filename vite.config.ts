import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss' // <-- 新增
import autoprefixer from 'autoprefixer' // <-- 新增

export default defineConfig({
  // 在這裡新增 css 設定
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  plugins: [react()],
})