import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';




const buildRemoteUrl = (mfeUrlEnv: string, adminPath = ''): string => {
  const url = process.env[mfeUrlEnv] || '';
  return `${url}${adminPath}/remoteEntry.js`;
};

// Build remote entry URLs for selfcareAdmin based on ENV
const adminRemoteUrl =
  process.env.REACT_APP_ENV === 'LOCAL_DEV'
    ? buildRemoteUrl('MICROFRONTEND_URL_ADMIN')
    : buildRemoteUrl('MICROFRONTEND_URL_ADMIN', '/onboarding');

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    // svgrPlugin(), // Enable after installing vite-plugin-svgr
    federation({
      name: 'host',
      remotes: {
        selfcareUsers: buildRemoteUrl('MICROFRONTEND_URL_USERS'),
        selfcareGroups: buildRemoteUrl('MICROFRONTEND_URL_GROUPS'),
        selfcareAdmin: adminRemoteUrl,
      },
      shared: [
        '@pagopa/selfcare-common-frontend',
        '@pagopa/mui-italia',
        '@pagopa/ts-commons',
        'react',
        'react-dom',
        'react-redux',
        'react-router-dom',
        '@emotion/react',
        '@emotion/styled',
        '@mui/icons-material',
        '@mui/material',
        '@mui/lab',
        '@mui/x-data-grid',
        '@mui/x-data-grid-generator',
        'i18next',
        'react-i18next',
        'core-js',
        'mixpanel-browser',
      ],
    }),
  ],
  base: '/',
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    exclude: ['@pagopa/selfcare-common-frontend'],
  },
  build: {
    outDir: 'build',
    target: 'esnext',
    reportCompressedSize: false,
    sourcemap: true,
    commonjsOptions: {
      // Prevent Vite from warning about .m?js imports (webpack compat)
      ignoreDynamicRequires: true,
      // Allow transforming mixed ESM/CJS modules (helps CRA-built packages)
      transformMixedEsModules: true,
    },
  },
  resolve: {
    // Prefer ESM `module` field but fall back to `main` if needed
    mainFields: ['module', 'main'],
  },
  define: {
    'process.env': {},
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
