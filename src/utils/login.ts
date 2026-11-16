import { ENV } from './env';

const ADMIN_ROUTE = `${ENV.PUBLIC_URL.replace(/\/$/, '')}/admin`;

export const isAdminRoute = (pathname: string): boolean =>
  pathname === ADMIN_ROUTE || pathname.startsWith(`${ADMIN_ROUTE}/`);

export const getLoginUrlForPath = (pathname: string): string =>
  isAdminRoute(pathname) ? ENV.URL_FE.LOGIN_GOOGLE : `${ENV.URL_FE.LOGIN}/login`;
