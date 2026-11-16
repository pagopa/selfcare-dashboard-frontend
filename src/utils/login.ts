import { matchPath } from 'react-router-dom';
import { ENV } from './env';

export const isAdminRoute = (pathname: string): boolean =>
  !!matchPath(pathname, { path: ENV.ROUTES.ADMIN });

export const getLoginUrlForPath = (pathname: string): string =>
  isAdminRoute(pathname) ? ENV.URL_FE.LOGIN_GOOGLE : `${ENV.URL_FE.LOGIN}/login`;
