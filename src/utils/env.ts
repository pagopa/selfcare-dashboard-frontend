

const PUBLIC_URL_INNER = import.meta.env.PUBLIC_URL || '/dashboard';
export const ENV = {
  ENV: import.meta.env.VITE_ENV,
  PUBLIC_URL: PUBLIC_URL_INNER,

  JSON_URL: {
    COUNTRIES: import.meta.env.VITE_COUNTRY_DATA,
  },

  BASE_PATH_CDN_URL: import.meta.env.VITE_URL_CDN,

  ASSISTANCE: {
    ENABLE: import.meta.env.VITE_ENABLE_ASSISTANCE === 'true',
    EMAIL: import.meta.env.VITE_PAGOPA_HELP_EMAIL,
  },

  URL_DOCUMENTATION: 'https://docs.pagopa.it/area-riservata/',

  ROUTES: {
    OVERVIEW: `${PUBLIC_URL_INNER}/:partyId`,
    USERS: `${PUBLIC_URL_INNER}/:partyId/users`,
    USERS_DETAIL: `${PUBLIC_URL_INNER}/:partyId/users/:userId`,
    PRODUCT_USERS: `${PUBLIC_URL_INNER}/:partyId/:productId/users`,
    GROUPS: `${PUBLIC_URL_INNER}/:partyId/groups`,
    GROUP_DETAIL: `${PUBLIC_URL_INNER}/:partyId/groups/:groupId`,

    ADMIN: `${PUBLIC_URL_INNER}/admin`,
    ADMIN_PARTY_DETAIL: `${PUBLIC_URL_INNER}/admin/onboarding/:tokenId`,
    ADMIN_SEARCH: `${PUBLIC_URL_INNER}/admin/search`,
  },

  URL_FE: {
    LOGIN: import.meta.env.VITE_URL_FE_LOGIN,
    LOGOUT: import.meta.env.VITE_URL_FE_LOGOUT,
    ONBOARDING: import.meta.env.VITE_URL_FE_ONBOARDING,
    LANDING: import.meta.env.VITE_URL_FE_LANDING,
    ASSISTANCE: import.meta.env.VITE_URL_FE_ASSISTANCE,
    LOGIN_GOOGLE: import.meta.env.VITE_GOOGLE_LOGIN_URL || '/auth/google',
  },

  URL_API: {
    API_DASHBOARD: import.meta.env.VITE_URL_API_DASHBOARD,
    PARTY_REGISTRY_PROXY: import.meta.env.VITE_URL_API_PARTY_REGISTRY_PROXY,
    ONBOARDING_V2: import.meta.env.VITE_URL_API_ONBOARDING_V2,
  },

  GEOTAXONOMY: {
    SHOW_GEOTAXONOMY: import.meta.env.VITE_ENABLE_GEOTAXONOMY === 'true',
  },

  API_TIMEOUT_MS: {
    DASHBOARD: parseInt(import.meta.env.VITE_API_DASHBOARD_TIMEOUT_MS || '30000', 10),
  },

  URL_INSTITUTION_LOGO: {
    PREFIX: import.meta.env.VITE_URL_INSTITUTION_LOGO_PREFIX,
    SUFFIX: import.meta.env.VITE_URL_INSTITUTION_LOGO_SUFFIX,
  },

  ANALYTCS: {
    ENABLE: import.meta.env.VITE_ANALYTICS_ENABLE === 'true',
    MOCK: import.meta.env.VITE_ANALYTICS_MOCK === 'true',
    DEBUG: import.meta.env.VITE_ANALYTICS_DEBUG === 'true',
    TOKEN: import.meta.env.VITE_MIXPANEL_TOKEN,
    API_HOST: import.meta.env.VITE_MIXPANEL_API_HOST || 'https://api-eu.mixpanel.com',
  },

  DELEGATIONS: {
    ENABLE: import.meta.env.VITE_DELEGATIONS_ENABLE === 'true',
  },

  MAX_ADMIN_COUNT: parseInt(import.meta.env.VITE_MAX_ADMIN_COUNT || '4', 10),

  SHOW_DOCUMENTS: import.meta.env.VITE_SHOW_DOCUMENTS === 'true',
  ENABLE_DORA: import.meta.env.VITE_ENABLE_DORA === 'true',
};
