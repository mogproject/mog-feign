import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true,
    port: 3000,
  },
  test: {
    environment: 'jsdom', // necessary for localStorage
    globals: true,
    // setupFiles: './src/setupTests.ts',
    include: ['./src/**/*.test.*'],
  },
});
