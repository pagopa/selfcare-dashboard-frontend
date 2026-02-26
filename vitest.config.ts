import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      exclude: [
        'src/index.tsx',
        'src/reportWebVitals.ts',
        'src/utils/constants.ts',
        'src/consentAndAnalyticsConfiguration.ts',
        'src/model',
        'src/views/onboardingPremium/components/subProductStepPricingPlan/*',
        'e2e/**',
      ],
    },
  },
});
