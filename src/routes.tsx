import { Redirect, useParams } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardOverview from './pages/dashboardOverview/DashboardOverview';
import PartySelectionContainer from './pages/partySelectionContainer/PartySelectionContainer';
import { ENV } from './utils/env';
import AddGroupPage from './pages/dashboardGroupEdit/AddGroupPage';
import EditGroupPage from './pages/dashboardGroupEdit/EditGroupPage';
import CloneGroupPage from './pages/dashboardGroupEdit/CloneGroupPage';
import GroupsPage from './pages/dashboardGroups/GroupsPage';
import GroupsDetailPage from './pages/dashboardGroupDetail/GroupDetailPage';

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
  PARTY_GROUPS: {
    path: `${BASE_ROUTE}/:institutionId/groups`,
    exact: false,
    subRoutes: {
      MAIN: {
        path: `${BASE_ROUTE}/:institutionId/groups`,
        exact: true,
        component: GroupsPage,
      },
      PARTY_GROUP_ADD: {
        path: `${BASE_ROUTE}/:institutionId/groups/add`,
        exact: true,
        component: AddGroupPage,
      },
      PARTY_GROUP_DETAIL: {
        path: `${BASE_ROUTE}/:institutionId/groups/:groupId`,
        exact: true,
        component: GroupsDetailPage,
      },
      PARTY_GROUP_EDIT: {
        path: `${BASE_ROUTE}/:institutionId/groups/:groupId/edit`,
        exact: true,
        component: EditGroupPage,
      },
      PARTY_GROUP_CLONE: {
        path: `${BASE_ROUTE}/:institutionId/groups/:groupId/clone`,
        exact: true,
        component: CloneGroupPage,
      },
    },
  },
  ...buildRedirectToBasePath(`${BASE_ROUTE}/:institutionId`),
};

export default ROUTES as { [key in keyof typeof ROUTES]: RouteConfig };
