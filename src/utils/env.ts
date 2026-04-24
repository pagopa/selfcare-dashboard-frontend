import { i18n } from 'i18next';
import { Store } from 'redux';

const requiredEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};

const optionalBoolEnv = (value: string | undefined, defaultValue = 'false'): boolean =>
  (value ?? defaultValue) === 'true';

const optionalStringEnv = (value: string | undefined, defaultValue: string): string =>
  value ?? defaultValue;

const PUBLIC_URL_INNER = import.meta.env.VITE_PUBLIC_URL || '/dashboard';

export const ENV = {
  STORE: {} as Store,
  i18n: {} as i18n,
  ENV: requiredEnv('VITE_ENV', import.meta.env.VITE_ENV),
  PUBLIC_URL: PUBLIC_URL_INNER,

  JSON_URL: {
    COUNTRIES: requiredEnv('VITE_COUNTRY_DATA', import.meta.env.VITE_COUNTRY_DATA),
  },

  BASE_PATH_CDN_URL: requiredEnv('VITE_URL_CDN', import.meta.env.VITE_URL_CDN),

  ASSISTANCE: {
    ENABLE: optionalBoolEnv(import.meta.env.VITE_ENABLE_ASSISTANCE),
    EMAIL: requiredEnv('VITE_PAGOPA_HELP_EMAIL', import.meta.env.VITE_PAGOPA_HELP_EMAIL),
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
    ADMIN_CONTRACT: `${PUBLIC_URL_INNER}/admin/contract`,
  },

  URL_FE: {
    LOGIN: requiredEnv('VITE_URL_FE_LOGIN', import.meta.env.VITE_URL_FE_LOGIN),
    LOGOUT: requiredEnv('VITE_URL_FE_LOGOUT', import.meta.env.VITE_URL_FE_LOGOUT),
    ONBOARDING: requiredEnv('VITE_URL_FE_ONBOARDING', import.meta.env.VITE_URL_FE_ONBOARDING),
    LANDING: requiredEnv('VITE_URL_FE_LANDING', import.meta.env.VITE_URL_FE_LANDING),
    ASSISTANCE: requiredEnv('VITE_URL_FE_ASSISTANCE', import.meta.env.VITE_URL_FE_ASSISTANCE),
    LOGIN_GOOGLE: optionalStringEnv(import.meta.env.VITE_GOOGLE_LOGIN_URL, '/auth/google'),
  },

  URL_API: {
    API_DASHBOARD: requiredEnv('VITE_URL_API_DASHBOARD', import.meta.env.VITE_URL_API_DASHBOARD),
    PARTY_REGISTRY_PROXY: requiredEnv(
      'VITE_URL_API_PARTY_REGISTRY_PROXY',
      import.meta.env.VITE_URL_API_PARTY_REGISTRY_PROXY
    ),
  },

  GEOTAXONOMY: {
    SHOW_GEOTAXONOMY: optionalBoolEnv(import.meta.env.VITE_ENABLE_GEOTAXONOMY),
  },

  API_TIMEOUT_MS: {
    DASHBOARD: Number.parseInt(
      requiredEnv('VITE_API_DASHBOARD_TIMEOUT_MS', import.meta.env.VITE_API_DASHBOARD_TIMEOUT_MS),
      10
    ),
  },

  URL_INSTITUTION_LOGO: {
    PREFIX: requiredEnv(
      'VITE_URL_INSTITUTION_LOGO_PREFIX',
      import.meta.env.VITE_URL_INSTITUTION_LOGO_PREFIX
    ),
    SUFFIX: requiredEnv(
      'VITE_URL_INSTITUTION_LOGO_SUFFIX',
      import.meta.env.VITE_URL_INSTITUTION_LOGO_SUFFIX
    ),
  },

  ANALYTCS: {
    ENABLE: optionalBoolEnv(import.meta.env.VITE_ANALYTICS_ENABLE),
    MOCK: optionalBoolEnv(import.meta.env.VITE_ANALYTICS_MOCK),
    DEBUG: optionalBoolEnv(import.meta.env.VITE_ANALYTICS_DEBUG),
    TOKEN: requiredEnv('VITE_MIXPANEL_TOKEN', import.meta.env.VITE_MIXPANEL_TOKEN),
    API_HOST: optionalStringEnv(import.meta.env.VITE_MIXPANEL_API_HOST, 'https://api-eu.mixpanel.com'),
  },

  DELEGATIONS: {
    ENABLE: optionalBoolEnv(import.meta.env.VITE_DELEGATIONS_ENABLE),
  },

  MAX_ADMIN_COUNT: optionalStringEnv(import.meta.env.VITE_MAX_ADMIN_COUNT, '4'),

  SHOW_DOCUMENTS: optionalBoolEnv(import.meta.env.VITE_SHOW_DOCUMENTS),
};
