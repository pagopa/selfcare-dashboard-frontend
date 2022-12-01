const { appDependencies } = require('./package.json');
const commonDependencies = require('@pagopa/selfcare-common-frontend/package.json').dependencies;
const muiItaliaDependencies = require('@pagopa/mui-italia/package.json').dependencies;

const dependencies = {
  ...muiItaliaDependencies,
  ...commonDependencies,
  ...appDependencies,
};

module.exports = {
  name: 'host',
  remotes: {
    selfcareUsers: `selfcareUsers@${process.env.MICROFRONTEND_URL_USERS}/remoteEntry.js`,
    selfcareGroups: `selfcareGroups@${process.env.MICROFRONTEND_URL_GROUPS}/remoteEntry.js`,
    selfcareAdmin: `selfcareAdmin@${
      process.env.REACT_APP_ENV === 'LOCAL_DEV'
        ? process.env.MICROFRONTEND_URL_ADMIN
        : process.env.MICROFRONTEND_URL_ADMIN + '/onboarding'
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
};
