/// <reference types="vite/client" />
/// <reference types="vitest/globals" />

interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'uat' | 'production';
  readonly VITE_API_MOCK_REQUEST_DATA: string;
  readonly VITE_ALLOWED_PRODUCTS_BACKSTAGE: string;
  VITE_API_MOCK_PARTIES: string;
  VITE_API_MOCK_PRODUCTS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
