import { createRequire } from 'module';
import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import svgr from 'vite-plugin-svgr';

const require = createRequire(import.meta.url);

const commonDependencies = require('@pagopa/selfcare-common-frontend/package.json').dependencies;
const muiItaliaDependencies = require('@pagopa/mui-italia/package.json').dependencies;
const appDependencies = require('./package.json').dependencies;

const dependencies: Record<string, string> = {
  ...muiItaliaDependencies,
  ...commonDependencies,
  ...appDependencies,
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
          '@pagopa/selfcare-common-frontend': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@pagopa/selfcare-common-frontend'],
          },
          '@pagopa/mui-italia': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@pagopa/mui-italia'],
          },
          '@pagopa/ts-commons': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@pagopa/ts-commons'],
          },
          react: {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['react'],
          },
          'react-dom': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['react-dom'],
          },
          'react-redux': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['react-redux'],
          },
          'react-router-dom': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['react-router-dom'],
          },
          '@emotion/react': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@emotion/react'],
          },
          '@emotion/styled': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@emotion/styled'],
          },
          '@mui/icons-material': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@mui/icons-material'],
          },
          '@mui/material': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@mui/material'],
          },
          '@mui/lab': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@mui/lab'],
          },
          '@mui/x-data-grid': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@mui/x-data-grid'],
          },
          '@mui/x-data-grid-generator': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['@mui/x-data-grid-generator'],
          },
          i18next: {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['i18next'],
          },
          'react-i18next': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['react-i18next'],
          },
          'core-js': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['core-js'],
          },
          'mixpanel-browser': {
            eager: true,
            singleton: true,
            requiredVersion: dependencies['mixpanel-browser'],
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
    base: '/dashboard/',
    build: {
      outDir: 'dist',
      target: 'esnext',
      sourcemap: true,
      minify: false,
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
      port: 3000,
      cors: true,
    },
  };
});
