import { Redirect, useParams } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardOverview from './pages/dashboardOverview/DashboardOverview';
import PartySelectionContainer from './pages/partySelectionContainer/PartySelectionContainer';
import { ENV } from './utils/env';

export const BASE_ROUTE = ENV.PUBLIC_URL;

export type RoutesObject = { [key: string]: RouteConfig };

export type RouteConfig = {
  path: string;
  exact?: boolean;
  subRoutes?: RoutesObject;
  component?: React.ComponentType<any>;
  withProductRolesMap?: boolean;
  withSelectedProduct?: boolean;
  withSelectedProductRoles?: boolean;
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
  ...buildRedirectToBasePath(`${BASE_ROUTE}/:institutionId`),
};

export default ROUTES as { [key in keyof typeof ROUTES]: RouteConfig };
