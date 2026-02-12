const getEnvVar = (key: string, required = true): string => {
  const value = import.meta.env[key];
  if (required && !value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value || '';
};

const getEnvBool = (key: string, defaultValue = false): boolean => {
  const value = import.meta.env[key];
  return value ? value === 'true' : defaultValue;
};

const getEnvInt = (key: string): number => parseInt(getEnvVar(key), 10);

export const ENV = {
  ENV: getEnvVar('VITE_ENV'),
  PUBLIC_URL: '/dashboard',

  JSON_URL: {
    COUNTRIES: getEnvVar('VITE_COUNTRY_DATA'),
  },

  BASE_PATH_CDN_URL: getEnvVar('VITE_URL_CDN'),

  ASSISTANCE: {
    ENABLE: getEnvBool('VITE_ENABLE_ASSISTANCE', false),
    EMAIL: getEnvVar('VITE_PAGOPA_HELP_EMAIL'),
  },

  URL_DOCUMENTATION: 'https://docs.pagopa.it/area-riservata/',

  ROUTES: {
    OVERVIEW: `/dashboard/:partyId`,
    USERS: `/dashboard/:partyId/users`,
    USERS_DETAIL: `/dashboard/:partyId/users/:userId`,
    PRODUCT_USERS: `/dashboard/:partyId/:productId/users`,
    GROUPS: `/dashboard/:partyId/groups`,
    GROUP_DETAIL: `/dashboard/:partyId/groups/:groupId`,

    ADMIN: `/dashboard/admin`,
    ADMIN_PARTY_DETAIL: `/dashboard/admin/onboarding/:tokenId`,
    ADMIN_SEARCH: `/dashboard/admin/search`,
  },

  URL_FE: {
    LOGIN: getEnvVar('VITE_URL_FE_LOGIN'),
    LOGOUT: getEnvVar('VITE_URL_FE_LOGOUT'),
    ONBOARDING: getEnvVar('VITE_URL_FE_ONBOARDING'),
    LANDING: getEnvVar('VITE_URL_FE_LANDING'),
    ASSISTANCE: getEnvVar('VITE_URL_FE_ASSISTANCE'),
    LOGIN_GOOGLE: getEnvVar('VITE_GOOGLE_LOGIN_URL', false),
  },

  URL_API: {
    API_DASHBOARD: getEnvVar('VITE_URL_API_DASHBOARD'),
    PARTY_REGISTRY_PROXY: getEnvVar('VITE_URL_API_PARTY_REGISTRY_PROXY'),
    ONBOARDING_V2: getEnvVar('VITE_URL_API_ONBOARDING_V2'),
  },

  GEOTAXONOMY: {
    SHOW_GEOTAXONOMY: getEnvBool('VITE_ENABLE_GEOTAXONOMY', false),
  },

  API_TIMEOUT_MS: {
    DASHBOARD: getEnvInt('VITE_API_DASHBOARD_TIMEOUT_MS'),
  },

  URL_INSTITUTION_LOGO: {
    PREFIX: getEnvVar('VITE_URL_INSTITUTION_LOGO_PREFIX'),
    SUFFIX: getEnvVar('VITE_URL_INSTITUTION_LOGO_SUFFIX'),
  },

  ANALYTCS: {
    ENABLE: getEnvBool('VITE_ANALYTICS_ENABLE', false),
    MOCK: getEnvBool('VITE_ANALYTICS_MOCK', false),
    DEBUG: getEnvBool('VITE_ANALYTICS_DEBUG', false),
    TOKEN: getEnvVar('VITE_MIXPANEL_TOKEN'),
    API_HOST: getEnvVar('VITE_MIXPANEL_API_HOST', false) || 'https://api-eu.mixpanel.com',
  },

  DELEGATIONS: {
    ENABLE: getEnvBool('VITE_DELEGATIONS_ENABLE', false),
  },

  MAX_ADMIN_COUNT: getEnvVar('VITE_MAX_ADMIN_COUNT', false) || '4',

  SHOW_DOCUMENTS: getEnvBool('VITE_SHOW_DOCUMENTS', false),
  ENABLE_DORA: getEnvBool('VITE_ENABLE_DORA', false),
};
