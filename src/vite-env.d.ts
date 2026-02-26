/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'uat' | 'production';

    VITE_API_MOCK_PARTIES: string;
    VITE_API_MOCK_PRODUCTS: string;
  }
}
interface Window {
  Stripe: any;
}
