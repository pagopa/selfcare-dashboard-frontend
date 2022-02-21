import { Redirect, useParams } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import Dashboard from './pages/dashboard/Dashboard';
import AddUserContainer from './pages/dashboardAddUser/AddUserContainer';
import DashboardOverview from './pages/dashboardOverview/DashboardOverview';
import PartySelectionContainer from './pages/partySelectionContainer/PartySelectionContainer';
import { ENV } from './utils/env';
import UserDetailPage from './pages/dashboardUserDetail/userDetailPage/UserDetailPage';
import UserProductDetailPage from './pages/dashboardUserDetail/userProductDetailPage/UserProductDetailPage';
import UsersPage from './pages/dashboardUsers/UsersPage/UsersPage';
import UsersProductPage from './pages/dashboardUsers/UsersProductPage/UsersProductPage';

export const BASE_ROUTE = ENV.PUBLIC_URL;

export type RoutesObject = { [key: string]: RouteConfig };

export type RouteConfig = {
  path: string;
  exact?: boolean;
  subRoutes?: RoutesObject;
  component?: React.ComponentType<any>;
};

const buildRedirectToBasePath = (basePath: string): RoutesObject => ({
  SUBPATH_DEFAULT: {
    path: `${basePath}/*`,
    component: (): React.FunctionComponentElement<any> => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathVariables: { [key: string]: string } = useParams();
      const effectiveBasePath = resolvePathVariables(basePath, pathVariables);
      return <Redirect to={`${effectiveBasePath || basePath}`} />;
    },
  },
});

const ROUTES = {
  PARTY_SELECTION: {
    path: `${BASE_ROUTE}`,
    exact: true,
    component: PartySelectionContainer,
  },
  PARTY_DASHBOARD: {
    path: `${BASE_ROUTE}/:institutionId`,
    exact: false,
    component: Dashboard,
  },
};

export const DASHBOARD_ROUTES = {
  OVERVIEW: {
    path: `${BASE_ROUTE}/:institutionId`,
    exact: true,
    component: DashboardOverview,
  },
  PARTY_USERS: {
    path: `${BASE_ROUTE}/:institutionId/roles`,
    exact: false,
    subRoutes: {
      MAIN: {
        path: `${BASE_ROUTE}/:institutionId/roles`,
        exact: true,
        component: UsersPage,
      },
      ADD_PARTY_USER: {
        path: `${BASE_ROUTE}/:institutionId/roles/add`,
        exact: true,
        component: AddUserContainer, // TODO redirect to correct form
      },
      PARTY_USER_DETAIL: {
        path: `${BASE_ROUTE}/:institutionId/roles/:userId`,
        exact: true,
        component: UserDetailPage,
      },
      ...buildRedirectToBasePath(`${BASE_ROUTE}/:institutionId/roles`),
    },
  },
  PARTY_PRODUCT_USERS: {
    path: `${BASE_ROUTE}/:institutionId/:productId/roles`,
    exact: false,
    subRoutes: {
      MAIN: {
        path: `${BASE_ROUTE}/:institutionId/:productId/roles`,
        exact: true,
        component: UsersProductPage,
      },
      ADD_PARTY_PRODUCT_USER: {
        path: `${BASE_ROUTE}/:institutionId/:productId/roles/add`,
        exact: true,
        component: AddUserContainer,
      },
      PARTY_PRODUCT_USER_DETAIL: {
        path: `${BASE_ROUTE}/:institutionId/:productId/roles/:userId`,
        exact: true,
        component: UserProductDetailPage,
      },
      ...buildRedirectToBasePath(`${BASE_ROUTE}/:institutionId/:productId/roles`),
    },
  },
  ...buildRedirectToBasePath(`${BASE_ROUTE}/:institutionId`),
};

export default ROUTES as { [key in keyof typeof ROUTES]: RouteConfig };
