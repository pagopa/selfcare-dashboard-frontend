import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import federation from '@originjs/vite-plugin-federation';

// Optional: SVG component loader
// To enable SVG React component imports (import { ReactComponent as Icon } from './icon.svg'):
// 1. Install plugin: npm install -D vite-plugin-svgr
// 2. Uncomment the svgrPlugin() line in the plugins array below
// import svgr from 'vite-plugin-svgr';
// const svgrPlugin = svgr({ exportAsDefault: false });

// Helper to build remote URLs based on environment
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
  server: {
    port: 3000,
    open: true,
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
  // Ensure Vite pre-bundles and SSR handling include the problematic package
  ssr: {
    noExternal: ['@pagopa/selfcare-common-frontend'],
  },
  optimizeDeps: {
    // Explicitly include dependencies to pre-bundle
    include: [
      '@pagopa/selfcare-common-frontend',
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      'redux',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
});
