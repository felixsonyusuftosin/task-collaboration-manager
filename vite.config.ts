import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(currentDirectoryPath, 'src/components'),
      '@store': path.resolve(currentDirectoryPath, 'src/store'),
      '@types': path.resolve(currentDirectoryPath, 'src/types'),
      '@utils': path.resolve(currentDirectoryPath, 'src/utils'),
      '@views': path.resolve(currentDirectoryPath, 'src/views'),
    },
  },
});
