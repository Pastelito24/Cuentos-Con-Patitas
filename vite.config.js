import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Elimina el rewrite para que pase la ruta tal cual
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/static': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    },
  },
});
