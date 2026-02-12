/// <reference types="vitest" />
/// <reference types="@testing-library/jest-dom" />

// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import './locale';
import { vi, beforeEach, beforeAll } from 'vitest';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

beforeAll(async () => {
  await i18n.changeLanguage('it');
});
