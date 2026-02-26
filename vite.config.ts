import path from 'path';
import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      svgr(),
      federation({
        name: 'host',
        remotes: {
          selfcareUsers: `${env.MICROFRONTEND_URL_USERS}/remoteEntry.js`,
          selfcareGroups: `${env.MICROFRONTEND_URL_GROUPS}/remoteEntry.js`,
          selfcareAdmin: `${
            env.VITE_ENV === 'LOCAL_DEV'
              ? env.MICROFRONTEND_URL_ADMIN
              : env.MICROFRONTEND_URL_ADMIN + '/onboarding'
          }/remoteEntry.js`,
        },
        shared: [
          '@pagopa/selfcare-common-frontend',
          'react',
          'react-dom',
          'react-redux',
          'react-router-dom',
          '@emotion/react',
          '@emotion/styled',
          '@mui/material',
          '@mui/icons-material',
          '@mui/lab',
          '@mui/x-data-grid',
          '@mui/x-data-grid-generator',
          '@pagopa/mui-italia',
          '@pagopa/ts-commons',
          'i18next',
          'react-i18next',
          'mixpanel-browser',
          'core-js',
        ],
      }),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_ENV: env.VITE_ENV,
            VITE_URL_CDN: env.VITE_URL_CDN,
            VITE_ONE_TRUST_BASE_URL: env.VITE_ONE_TRUST_BASE_URL,
            VITE_ONETRUST_DOMAIN_ID: env.VITE_ONETRUST_DOMAIN_ID,
          },
        },
      }),
    ],
    base: '/dashboard/',
    build: {
      outDir: 'dist',
      target: 'esnext',
      modulePreload: false,
      cssCodeSplit: false,
      sourcemap: true,
      minify: false,
    },
    define: {
      'process.env': Object.fromEntries(
        Object.entries(env).filter(([key]) => key.startsWith('VITE_'))
      ),
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-redux'],
    },
    server: {
      port: 3000,
      cors: true,
    },
    preview: {
      port: 3000,
      cors: true,
    },
    resolve: {
      dedupe: ['react', 'react-dom', 'react-redux'],
      alias: [
        {
          find: /^@pagopa\/selfcare-common-frontend$/,
          replacement: path.resolve(
            './node_modules/@pagopa/selfcare-common-frontend/lib/index.js'
          ),
        },
      ],
    },
  };
});
