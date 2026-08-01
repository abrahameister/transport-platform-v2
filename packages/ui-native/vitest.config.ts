import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    alias: {
      'react-native': 'react-native-web',
    },
  },
});
