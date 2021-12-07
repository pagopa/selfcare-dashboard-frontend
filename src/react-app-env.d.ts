/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'uat' | 'production';

    REACT_APP_URL_FE_LOGIN: string;
    REACT_APP_URL_FE_LOGOUT: string;
    REACT_APP_URL_FE_ONBOARDING: string;
    REACT_APP_URL_FE_LANDING: string;

    REACT_APP_URL_API_DASHBOARD: string;
    REACT_APP_API_DASHBOARD_TIMEOUT_MS: number;

    REACT_APP_URL_INSTITUTION_LOGO_PREFIX: string;
    REACT_APP_URL_INSTITUTION_LOGO_SUFFIX: string;

    REACT_APP_API_MOCK_PARTIES: string;
    REACT_APP_API_MOCK_PRODUCTS: string;

    REACT_APP_PAGOPA_HELP_EMAIL: string;
  }
}
interface Window {
  Stripe: any;
}
