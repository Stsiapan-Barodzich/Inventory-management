import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@Contexts': path.resolve(__dirname, './src/Contexts'),
      '@Routes': path.resolve(__dirname, './src/Routes'),
      '@Styles': path.resolve(__dirname, './src/Styles'),
      '@hooks': path.resolve(__dirname, './src/hooks'),

    },
  },
});
