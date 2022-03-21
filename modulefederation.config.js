const { dependencies } = require('./package.json');
const commonDependencies = require('@pagopa/selfcare-common-frontend/package.json').dependencies;

module.exports = {
  name: 'host',
  remotes: {
    selfcareUsers: `selfcareUsers@${process.env.MICROFRONTEND_URL_USERS}/remoteEntry.js`,
  },
  shared: {
    '@pagopa/selfcare-common-frontend': {
      singleton: true,
      requiredVersion: dependencies['@pagopa/selfcare-common-frontend'],
    },
    react: {
      singleton: true,
      requiredVersion: dependencies['react'],
    },
    'react-dom': {
      singleton: true,
      requiredVersion: dependencies['react-dom'],
    },
  },
};
