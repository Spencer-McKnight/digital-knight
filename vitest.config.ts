import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // `server-only` is a Next build-time guard (throws on client imports).
      // Tests run in Node, so we stub it to an empty module.
      'server-only': path.resolve(__dirname, './test/stubs/server-only.ts'),
    },
  },
  test: {
    include: ['src/**/__tests__/**/*.test.ts'],
    environment: 'node',
    globals: false,
  },
});
