// Read environment variables set by Vite at build time (`import.meta.env.VITE_*`).
// Variables are injected from the system environment during build.
// For dev, set VITE_* environment variables directly (e.g., export VITE_ENV=development).
// Keep a compatibility layer so code can still rely on old REACT_APP_* key names.

type RawEnv = Record<string, unknown>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const metaEnv: Record<string, any> = (import.meta.env || {}) as any;
const viteEnv = ((globalThis as any).viteEnv as RawEnv) || {};

function raw(key: string): string | undefined {
  // Map CRA-style keys to Vite-style `VITE_` keys when possible
  if (key === 'PUBLIC_URL') {
    return metaEnv.VITE_PUBLIC_URL ?? (viteEnv.PUBLIC_URL as string | undefined);
  }
  if (key.startsWith('REACT_APP_')) {
    const suffix = key.substring('REACT_APP_'.length);
    return metaEnv[`VITE_${suffix}`] ?? (viteEnv as any)[key];
  }
  // Fallback to direct VITE_ key if provided
  return metaEnv[key] ?? (viteEnv as any)[key];
}

function getString(key: string, required = false, defaultValue?: string): string {
  const value = raw(key);
  if ((value === undefined || value === '') && required && defaultValue === undefined) {
    throw new TypeError(`Environment variable ${key} is required but was not provided`);
  }
  return (value ?? defaultValue) as string;
}

function getBool(key: string, defaultValue = false): boolean {
  const value = raw(key);
  if (value === undefined) {
    return defaultValue;
  }
  const s = String(value).toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
}

function getInt(key: string, required = false, defaultValue?: number): number {
  const value = raw(key);
  if ((value === undefined || value === '') && required && defaultValue === undefined) {
    throw new TypeError(`Environment variable ${key} is required but was not provided`);
  }
  if (value === undefined || value === '') {
    return defaultValue as number;
  }
  const n = Number.parseInt(String(value), 10);
  if (Number.isNaN(n)) {
    throw new TypeError(`Environment variable ${key} is not a valid int`);
  }
  return n;
}

const PUBLIC_URL_INNER: string = getString('PUBLIC_URL', false, '/dashboard');

export const ENV = {
  ENV: getString('REACT_APP_ENV', true),
  PUBLIC_URL: PUBLIC_URL_INNER,

  JSON_URL: {
    COUNTRIES: getString('REACT_APP_COUNTRY_DATA', true),
  },

  BASE_PATH_CDN_URL: getString('REACT_APP_URL_CDN', true),

  ASSISTANCE: {
    ENABLE: getBool('REACT_APP_ENABLE_ASSISTANCE', false),
    EMAIL: getString('REACT_APP_PAGOPA_HELP_EMAIL', true),
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
    ADMIN_SEARCH: `${getString('PUBLIC_URL', false, '')}/admin/search`,
  },

  URL_FE: {
    LOGIN: getString('REACT_APP_URL_FE_LOGIN', true),
    LOGOUT: getString('REACT_APP_URL_FE_LOGOUT', true),
    ONBOARDING: getString('REACT_APP_URL_FE_ONBOARDING', true),
    LANDING: getString('REACT_APP_URL_FE_LANDING', true),
    ASSISTANCE: getString('REACT_APP_URL_FE_ASSISTANCE', true),
    LOGIN_GOOGLE: getString('REACT_APP_GOOGLE_LOGIN_URL', false, '/auth/google'),
  },

  URL_API: {
    API_DASHBOARD: getString('REACT_APP_URL_API_DASHBOARD', true),
    PARTY_REGISTRY_PROXY: getString('REACT_APP_URL_API_PARTY_REGISTRY_PROXY', true),
    ONBOARDING_V2: getString('REACT_APP_URL_API_ONBOARDING_V2', true),
  },

  GEOTAXONOMY: {
    SHOW_GEOTAXONOMY: getBool('REACT_APP_ENABLE_GEOTAXONOMY', false),
  },

  API_TIMEOUT_MS: {
    DASHBOARD: getInt('REACT_APP_API_DASHBOARD_TIMEOUT_MS', true),
  },

  URL_INSTITUTION_LOGO: {
    PREFIX: getString('REACT_APP_URL_INSTITUTION_LOGO_PREFIX', true),
    SUFFIX: getString('REACT_APP_URL_INSTITUTION_LOGO_SUFFIX', true),
  },

  ANALYTCS: {
    ENABLE: getBool('REACT_APP_ANALYTICS_ENABLE', false),
    MOCK: getBool('REACT_APP_ANALYTICS_MOCK', false),
    DEBUG: getBool('REACT_APP_ANALYTICS_DEBUG', false),
    TOKEN: getString('REACT_APP_MIXPANEL_TOKEN', true),
    API_HOST: getString('REACT_APP_MIXPANEL_API_HOST', false, 'https://api-eu.mixpanel.com'),
  },

  DELEGATIONS: {
    ENABLE: getBool('REACT_APP_DELEGATIONS_ENABLE', false),
  },

  MAX_ADMIN_COUNT: getString('REACT_APP_MAX_ADMIN_COUNT', false, '4'),

  SHOW_DOCUMENTS: getBool('REACT_APP_SHOW_DOCUMENTS', false),
  ENABLE_DORA: getBool('REACT_APP_ENABLE_DORA', false),
};
