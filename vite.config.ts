import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const buildRemoteUrl = (mfeUrlEnv: string, adminPath = ''): string => {
  const url = process.env[mfeUrlEnv] || '';
  return `${url}${adminPath}/remoteEntry.js`;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env with loaded variables so they can be used in the config
  Object.assign(process.env, env);

  // Build remote entry URLs for selfcareAdmin based on ENV
  const adminRemoteUrl =
    process.env.REACT_APP_ENV === 'LOCAL_DEV'
      ? buildRemoteUrl('MICROFRONTEND_URL_ADMIN')
      : buildRemoteUrl('MICROFRONTEND_URL_ADMIN', '/onboarding');

  return {
    plugins: [
      react(),
      tsconfigPaths(),
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
    envPrefix: ['VITE_', 'REACT_APP_'],
    base: '/',
    server: {
      port: 3000,
      open: true,
      fs: {
        allow: ['..'],
      },
    },
    build: {
      outDir: 'build',
      target: 'esnext',
      reportCompressedSize: false,
      sourcemap: true,
      commonjsOptions: {
        ignoreDynamicRequires: true,
        transformMixedEsModules: true,
      },
    },
    resolve: {
      mainFields: ['module', 'main'],
      alias: {
        '@pagopa/selfcare-common-frontend/index.css': resolve(
          __dirname,
          '../selfcare-common-frontend/dist/selfcare-common-frontend.css'
        ),
      },
    },
    optimizeDeps: {
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
  };
});
