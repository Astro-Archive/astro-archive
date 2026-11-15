import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? (process.env.BASE_PATH || '/astro-archive/') : '/',
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        // Showcase de los componentes portados desde Figma (Sci-fi UI Kit)
        kit: fileURLToPath(new URL('./kit.html', import.meta.url)),
      },
    },
  },
}));
