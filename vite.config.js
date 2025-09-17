// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');      // ← loads .env.demo
  const base = '/clients/aspon/pathwaychecker_v2/';
  return {
    base,
    plugins: [react()],
    assetsInclude: ['**/*.svg'],
  };
});
