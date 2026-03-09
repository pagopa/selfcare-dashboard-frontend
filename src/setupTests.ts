import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

beforeAll(async () => {
  if (!i18n.isInitialized) {
    await i18n
      .use(initReactI18next)
      .init({
        resources: { it: { translation: {} } }, // ← empty stub, not full locales
        lng: 'it',
        fallbackLng: 'it',
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
      });
  }
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks(); // redundant with config but explicit
});