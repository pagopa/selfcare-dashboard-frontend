import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgr from 'vite-plugin-svgr';

import muiItaliaPackage from '@pagopa/mui-italia/package.json';
import commonPackage from '@pagopa/selfcare-common-frontend/package.json';
import dashboardPackage from './package.json';

const { dependencies } = dashboardPackage;
const commonDependencies = commonPackage.dependencies;
const muiItaliaDependencies = muiItaliaPackage.dependencies;

const mixedDependencies = {
  ...muiItaliaDependencies,
  ...commonDependencies,
  ...dependencies,
};

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
        shared: {
          '@pagopa/mui-italia': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['@pagopa/mui-italia'],
          },
          '@pagopa/ts-commons': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['@pagopa/ts-commons'],
          },
          react: {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['react'],
          },
          'react-dom': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['react-dom'],
          },
          'react-redux': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['react-redux'],
          },
          'react-router-dom': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['react-router-dom'],
          },
          '@emotion/react': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['@emotion/react'],
          },
          '@emotion/styled': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['@emotion/styled'],
          },
          '@mui/icons-material': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['@mui/icons-material'],
          },
          '@mui/material': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['@mui/material'],
          },
          '@mui/lab': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['@mui/lab'],
          },
          '@mui/x-data-grid': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['@mui/x-data-grid'],
          },
          '@mui/x-data-grid-generator': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['@mui/x-data-grid-generator'],
          },
          i18next: {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['i18next'],
          },
          'react-i18next': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['react-i18next'],
          },
          'core-js': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['core-js'],
          },
          'mixpanel-browser': {
            eager: true,
            singleton: true,
            requiredVersion: mixedDependencies['mixpanel-browser'],
          },
        },
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
    build: {
      outDir: 'dist',
      sourcemap: true,
    },
    define: {
      'process.env': Object.fromEntries(
        Object.entries(env).filter(([key]) => key.startsWith('VITE_'))
      ),
    },
    server: {
      port: 3000,
      cors: true,
    },
    preview: {
      port: 3001,
      cors: true,
    },
  };
});
