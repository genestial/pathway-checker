// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');      // ← loads .env.demo
  const base = env.VITE_APP_BASE_URL || '/';
  return {
    base,
    plugins: [react()],
    assetsInclude: ['**/*.svg'],
  };
});
