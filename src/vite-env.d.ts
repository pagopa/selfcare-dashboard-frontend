// eslint-disable-next-line @typescript-eslint/triple-slash-reference, spaced-comment// / <reference types="vite/client" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'uat' | 'production';
  }
}

interface ImportMetaEnv {
  readonly VITE_COUNTRY_DATA: string;
  readonly VITE_URL_CDN: string;
  readonly VITE_ENABLE_ASSISTANCE: string;
  readonly VITE_PAGOPA_HELP_EMAIL: string;
  readonly VITE_URL_FE_LOGIN: string;
  readonly VITE_URL_FE_LOGOUT: string;
  readonly VITE_URL_FE_ONBOARDING: string;
  readonly VITE_URL_FE_LANDING: string;
  readonly VITE_URL_FE_ASSISTANCE: string;
  readonly VITE_GOOGLE_LOGIN_URL?: string;
  readonly VITE_URL_API_DASHBOARD: string;
  readonly VITE_URL_API_PARTY_REGISTRY_PROXY: string;
  readonly VITE_URL_API_ONBOARDING_V2: string;
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
  readonly VITE_ENABLE_DORA?: string;
  readonly VITE_PUBLIC_URL?: string;
  readonly VITE_ONE_TRUST_BASE_URL?: string;
  readonly VITE_ONETRUST_DOMAIN_ID?: string;
  VITE_API_MOCK_PARTIES?: string;
  VITE_API_MOCK_PRODUCTS?: string;
  VITE_ENV?: string;
  VITE_MICROFRONTEND_URL_USERS?: string;
  VITE_MICROFRONTEND_URL_GROUPS?: string;
  VITE_MICROFRONTEND_URL_ADMIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  Stripe: any;
}
