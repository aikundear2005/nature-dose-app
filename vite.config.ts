import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { type UserConfig } from 'vitest/config';

// https://vitejs.dev/config/
const config: { test: any } & { plugins: any[]; server?: any } = {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: {
    proxy: {
      // 將 /api 的請求代理到同一個伺服器上
      // 這在使用 `vercel dev` 時是必要的，以便 Vercel CLI 能正確攔截並執行 serverless functions
      '/api': {
        target: 'http://localhost:5173', // 或者你的 dev server 運行的實際位址
        changeOrigin: true,
      },
    },
  },
};

export default defineConfig(config);