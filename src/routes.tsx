import { Redirect, useParams } from 'react-router';
import Dashboard from './pages/dashboard/Dashboard';
import PartySelectionContainer from './pages/partySelectionContainer/PartySelectionContainer';

export const BASE_ROUTE = process.env.PUBLIC_URL ? process.env.PUBLIC_URL : '/dashboard';

export type RoutesObject = { [key: string]: RouteConfig };

export type RouteConfig = {
  path: string;
  exact?: boolean;
  subRoutes?: RoutesObject;
  component?: React.FunctionComponent<any>;
};

const buildRedirectToBasePath = (basePath: string): RoutesObject => ({
  SUBPATH_DEFAULT: {
    path: `${basePath}/*`,
    component: (): React.FunctionComponentElement<any> => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const pathVariables: { [key: string]: string } = useParams();
      const effectiveBasePath = Object.keys(pathVariables).reduce(
        (result, key) => result.replace(`:${key}`, pathVariables[key]),
        basePath
      );
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
    subRoutes: buildRedirectToBasePath(`${BASE_ROUTE}/:institutionId`),
  },
};

export default ROUTES as { [key in keyof typeof ROUTES]: RouteConfig };
