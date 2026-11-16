import { CONFIG } from '@pagopa/selfcare-common-frontend/lib/config/env';
import { useLogin } from '@pagopa/selfcare-common-frontend/lib/hooks/useLogin';
import { withOnSuccess } from '@pagopa/selfcare-common-frontend/lib/utils/login-utils';
import { storageUserOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { waitFor } from '@testing-library/react';
import { createElement, useEffect } from 'react';
import { ENV } from '../env';
import { getLoginUrlForPath, isAdminRoute } from '../login';
import { renderWithProviders } from '../test-utils';

describe('admin route login selection', () => {
  test.each([
    `${ENV.PUBLIC_URL}/admin`,
    `${ENV.PUBLIC_URL}/Admin`,
    `${ENV.PUBLIC_URL}/admin/search`,
    `${ENV.PUBLIC_URL}/admin/onboarding/token-1`,
    `${ENV.PUBLIC_URL}/Admin/onboarding/token-1`,
  ])('recognizes %s as an admin route', (pathname) => {
    expect(isAdminRoute(pathname)).toBe(true);
    expect(getLoginUrlForPath(pathname)).toBe(ENV.URL_FE.LOGOUT_GOOGLE);
  });

  test('does not treat similarly-prefixed non-admin routes as admin', () => {
    expect(isAdminRoute(`${ENV.PUBLIC_URL}/administrator`)).toBe(false);
    expect(getLoginUrlForPath(`${ENV.PUBLIC_URL}/party-selection`)).toBe(
      `${ENV.URL_FE.LOGIN}/login`
    );
  });

  test.each([
    [`${ENV.PUBLIC_URL}/admin/onboarding/token-1`, ENV.URL_FE.LOGOUT_GOOGLE],
    [`${ENV.PUBLIC_URL}/party-selection`, `${ENV.URL_FE.LOGIN}/login`],
  ])('redirects a logged-out user from %s to the appropriate login', async (pathname, loginUrl) => {
    const assign = vi.fn();
    const previousLogin = CONFIG.URL_FE.LOGIN;
    const previousMockUser = CONFIG.MOCKS.MOCK_USER;
    vi.stubGlobal('location', { pathname, search: '?source=email', assign });
    vi.spyOn(storageUserOps, 'read').mockReturnValue({} as ReturnType<typeof storageUserOps.read>);
    vi.spyOn(storageUserOps, 'delete').mockImplementation(() => {});
    // eslint-disable-next-line functional/immutable-data
    CONFIG.MOCKS.MOCK_USER = false;
    // eslint-disable-next-line functional/immutable-data
    CONFIG.URL_FE.LOGIN = withOnSuccess(getLoginUrlForPath(pathname));

    try {
      const LoginCheck = () => {
        const { attemptSilentLogin } = useLogin();
        useEffect(() => {
          void attemptSilentLogin();
        }, []);
        return null;
      };
      renderWithProviders(createElement(LoginCheck));

      await waitFor(() =>
        expect(assign).toHaveBeenCalledWith(
          `${loginUrl}?onSuccess=${encodeURIComponent(`${pathname}?source=email`)}`
        )
      );
    } finally {
      // eslint-disable-next-line functional/immutable-data
      CONFIG.URL_FE.LOGIN = previousLogin;
      // eslint-disable-next-line functional/immutable-data
      CONFIG.MOCKS.MOCK_USER = previousMockUser;
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    }
  });
});
