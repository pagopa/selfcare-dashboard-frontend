/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'uat' | 'production';
  readonly VITE_ENV: string;
  readonly VITE_PUBLIC_URL?: string;
  readonly VITE_COUNTRY_DATA: string;
  readonly VITE_URL_CDN: string;
  readonly VITE_ENABLE_ASSISTANCE?: string;
  readonly VITE_PAGOPA_HELP_EMAIL: string;
  readonly VITE_URL_FE_LOGIN: string;
  readonly VITE_URL_FE_LOGOUT: string;
  readonly VITE_URL_FE_ONBOARDING: string;
  readonly VITE_URL_FE_LANDING: string;
  readonly VITE_URL_FE_ASSISTANCE: string;
  readonly VITE_GOOGLE_LOGIN_URL?: string;
  readonly VITE_URL_API_DASHBOARD: string;
  readonly VITE_URL_API_PARTY_REGISTRY_PROXY: string;
  readonly VITE_ENABLE_GEOTAXONOMY?: string;
  readonly VITE_API_DASHBOARD_TIMEOUT_MS: string;
  readonly VITE_URL_INSTITUTION_LOGO_PREFIX: string;
  readonly VITE_URL_INSTITUTION_LOGO_SUFFIX: string;
  readonly VITE_ANALYTICS_ENABLE?: string;
  readonly VITE_ANALYTICS_MOCK?: string;
  readonly VITE_ANALYTICS_DEBUG?: string;
  readonly VITE_MIXPANEL_TOKEN: string;
  readonly VITE_MIXPANEL_API_HOST?: string;
  readonly VITE_DELEGATIONS_ENABLE?: string;
  readonly VITE_MAX_ADMIN_COUNT?: string;
  readonly VITE_SHOW_DOCUMENTS?: string;
  readonly VITE_API_MOCK_REQUEST_DATA: string;
  readonly VITE_ALLOWED_PRODUCTS_BACKSTAGE: string;
  readonly VITE_API_MOCK_PARTIES: string;
  readonly VITE_API_MOCK_PRODUCTS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
