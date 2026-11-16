import { ENV } from '../env';
import { getLoginUrlForPath, isAdminRoute } from '../login';

describe('admin route login selection', () => {
  test.each([
    `${ENV.PUBLIC_URL}/admin`,
    `${ENV.PUBLIC_URL}/Admin`,
    `${ENV.PUBLIC_URL}/admin/search`,
    `${ENV.PUBLIC_URL}/admin/onboarding/token-1`,
    `${ENV.PUBLIC_URL}/Admin/onboarding/token-1`,
  ])('recognizes %s as an admin route', (pathname) => {
    expect(isAdminRoute(pathname)).toBe(true);
    expect(getLoginUrlForPath(pathname)).toBe(ENV.URL_FE.LOGIN_GOOGLE);
  });

  test('does not treat similarly-prefixed non-admin routes as admin', () => {
    expect(isAdminRoute(`${ENV.PUBLIC_URL}/administrator`)).toBe(false);
    expect(getLoginUrlForPath(`${ENV.PUBLIC_URL}/party-selection`)).toBe(
      `${ENV.URL_FE.LOGIN}/login`
    );
  });
});
