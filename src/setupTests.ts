import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import it from './locale/it';

void i18n.use(initReactI18next).init({
  resources: {
    it: { translation: it },
  },
  lng: 'it',
  fallbackLng: 'it',
  initImmediate: false,
  interpolation: { escapeValue: false },
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});