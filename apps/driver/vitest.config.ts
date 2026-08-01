import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    environment: 'node',
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
  },
});
