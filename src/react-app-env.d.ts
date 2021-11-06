// eslint-disable-next-line spaced-comment
/// <reference types="react-scripts" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'uat' | 'production';
    REACT_APP_LOGIN_URL: string;
    REACT_APP_LOGOUT_URL: string;
    REACT_APP_DASHBOARD_URL: string;

    REACT_APP_URL_API_PARTY_PROCESS: string;
    REACT_APP_API_PARTY_PROCESS_TIMEOUT_MS: number;
  }
}
interface Window {
  Stripe: any;
}
