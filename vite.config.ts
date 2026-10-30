import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  server: {
    proxy: {
      // Proxy OSRM requests to bypass potential network latency / SNI issues
      '/osrm-api': {
        target: 'https://router.project-osrm.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/osrm-api/, ''),
        secure: true,
      },
      // Proxy Wikipedia REST API for live POI enrichment
      '/wiki-api': {
        target: 'https://en.wikipedia.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wiki-api/, ''),
        secure: true,
      },
    },
  },
});
