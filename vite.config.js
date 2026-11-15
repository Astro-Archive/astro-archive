import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? (process.env.BASE_PATH || '/astro-archive/') : '/',
  build: {
    rollupOptions: {
      input: {
        main: new URL('./index.html', import.meta.url).pathname,
        // Showcase de los componentes portados desde Figma (Sci-fi UI Kit)
        kit: new URL('./kit.html', import.meta.url).pathname,
      },
    },
  },
}));
