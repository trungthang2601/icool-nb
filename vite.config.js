import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

// NOTE: This is a Vanilla JS project, not Svelte
// Svelte dependencies were removed as they are not used

export default defineConfig({
  root: '.',
  plugins: [
    // No Svelte plugin - this is Vanilla JS
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild', // Use esbuild (faster, built-in) instead of terser
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'chart': ['chart.js'],
          'xlsx': ['xlsx'],
          'image-compression': ['browser-image-compression']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  optimizeDeps: {
    include: ['chart.js', 'xlsx', 'browser-image-compression']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url))
    }
  }
});

