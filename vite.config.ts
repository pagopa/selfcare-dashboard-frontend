import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';

const buildRemoteUrl = (mfeUrlEnv: string, adminPath = ''): string => {
  const url = process.env[mfeUrlEnv] || '';
  return `${url}${adminPath}/remoteEntry.js`;
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Build remote entry URLs for selfcareAdmin based on ENV
  const adminRemoteUrl =
    env.VITE_ENV === 'LOCAL_DEV'
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
      createHtmlPlugin({
        inject: {
          data: {
            VITE_URL_CDN: env.VITE_URL_CDN || '',
            VITE_ONE_TRUST_BASE_URL: env.VITE_ONE_TRUST_BASE_URL || '',
            VITE_ONETRUST_DOMAIN_ID: env.VITE_ONETRUST_DOMAIN_ID || '',
          },
        },
      }),
    ],
    base: '/dashboard/',
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    define: {
      'process.env': Object.fromEntries(
        Object.entries(env).filter(([key]) => key.startsWith('VITE_'))
      ),
    },
  };
});
