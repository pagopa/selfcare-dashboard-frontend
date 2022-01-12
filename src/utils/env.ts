import * as env from 'env-var';

const PUBLIC_URL_INNER: string | undefined = env.get('PUBLIC_URL').asString();
export const ENV = {
  PUBLIC_URL: PUBLIC_URL_INNER ? PUBLIC_URL_INNER : '/dashboard',

  ASSISTANCE: {
    ENABLE: env.get('REACT_APP_ENABLE_ASSISTANCE').required().asBool(),
    EMAIL: env.get('REACT_APP_PAGOPA_HELP_EMAIL').required().asString(),
  },

  URL_FE: {
    LOGIN: env.get('REACT_APP_URL_FE_LOGIN').required().asString(),
    LOGOUT: env.get('REACT_APP_URL_FE_LOGOUT').required().asString(),
    ONBOARDING: env.get('REACT_APP_URL_FE_ONBOARDING').required().asString(),
    LANDING: env.get('REACT_APP_URL_FE_LANDING').required().asString(),
  },

  URL_API: {
    API_DASHBOARD: env.get('REACT_APP_URL_API_DASHBOARD').required().asString(),
  },

  API_TIMEOUT_MS: {
    DASHBOARD: env.get('REACT_APP_API_DASHBOARD_TIMEOUT_MS').required().asInt(),
  },

  URL_INSTITUTION_LOGO: {
    PREFIX: env.get('REACT_APP_URL_INSTITUTION_LOGO_PREFIX').required().asString(),
    SUFFIX: env.get('REACT_APP_URL_INSTITUTION_LOGO_SUFFIX').required().asString(),
  },

  PARTY_USERS_PAGE_SIZE: env.get('REACT_APP_PARTY_USERS_PAGE_SIZE').required().asInt(),
};
