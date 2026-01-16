import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
    reporters: ['default', 'junit'],
    outputFile: 'test-report.junit.xml',
  },
});
