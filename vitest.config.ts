import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import svgr from 'vite-plugin-svgr';
import type { Plugin } from 'vite';

// mui-italia and selfcare-common-frontend import icons from the @mui/icons-material barrel, which
// loads every icon (~3s per test file). Rewrite those imports to per-icon paths: same CJS modules,
// just far fewer of them.
const iconBarrelImporters = /\/node_modules\/@pagopa\/(mui-italia|selfcare-common-frontend)\//;
const perIconImports = (): Plugin => ({
  name: 'per-icon-imports',
  enforce: 'pre',
  transform(code, id) {
    if (!iconBarrelImporters.test(id)) {
      return null;
    }
    const rewritten = code.replace(
      /import\s*\{([^}]*)\}\s*from\s*["']@mui\/icons-material["'];?/g,
      (_match, specifiers: string) =>
        specifiers
          .split(',')
          .map((specifier) => specifier.trim())
          .filter(Boolean)
          .map((specifier) => {
            const [icon, local = icon] = specifier.split(/\s+as\s+/);
            return `import ${local} from "@mui/icons-material/${icon}";`;
          })
          .join('')
    );
    return rewritten === code ? null : { code: rewritten, map: null };
  },
});

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [svgr() as any, perIconImports()],
  resolve: {
    alias: {
      i18next: resolve('node_modules/i18next/dist/esm/i18next.js'),
      'selfcareAdmin/RoutingAdmin': resolve('src/__mocks__/federation-env.tsx'),
      'selfcareUsers/RoutingUsers': resolve('src/__mocks__/federation-env.tsx'),
      'selfcareGroups/RoutingGroups': resolve('src/__mocks__/federation-env.tsx'),
      'selfcareUsers/RoutingProductUsers': resolve('src/__mocks__/federation-env.tsx'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    server: {
      deps: {
        inline: ['@pagopa/mui-italia'],
      },
    },
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['**/node_modules/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      exclude: [
        'src/index.js',
        'src/bootstrap.tsx',
        'src/setupTests.ts',
        'src/utils/constants.ts',
        'src/consentAndAnalyticsConfiguration.ts',
        'src/model/**',
        'src/views/onboardingPremium/components/subProductStepPricingPlan/*',
        'e2e/**',
        'src/api/generated/**',
        'src/locale/**',
        '**/__mocks__/**',
        '**/*.d.ts',
        '**/*.svg',
        'src/utils/test-utils.tsx',
      ],
    },
  },
});
