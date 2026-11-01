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
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/maplibre-gl')) {
            return 'vendor-maplibre';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('src/data/karnatakaTravelRegistry') || id.includes('src/data/karnataka500Registry')) {
            return 'dataset-karnataka';
          }
        },
      },
    },
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
