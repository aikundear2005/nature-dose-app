import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { type UserConfig } from 'vitest/config';

// https://vitejs.dev/config/
const config: UserConfig & { server?: any } = {
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 保持本地 vercel dev 的代理
        changeOrigin: true,
      },
    },
  },
};

export default defineConfig(config);