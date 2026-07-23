import { useTheme } from '@mui/material';
import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend/lib';
import withLogin from '@pagopa/selfcare-common-frontend/lib/decorators/withLogin';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { matchPath, Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import RemoteRoutingAdmin from './microcomponents/admin/RemoteRoutingAdmin';
import DashboardAdminPage from './pages/dashboardAdmin/DasboardAdmin';
import { useAppDispatch } from './redux/hooks';
import { markAdminPermissionsStale } from './redux/slices/adminRolesSlice';
import routes, { RoutesObject } from './routes';
import { ENV } from './utils/env';

const buildRoutes = (rs: RoutesObject) =>
  Object.values(rs).map(({ path, exact, component: Component, subRoutes }, i) => (
    <Route path={path} exact={exact} key={i}>
      {Component && <Component />}
      {subRoutes && <Switch>{buildRoutes(subRoutes)}</Switch>}
    </Route>
  ));

const App = () => {
  const store = useStore();
  const theme = useTheme();
  const { i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const isPartyDetail = !!matchPath(location.pathname, {
      path: ENV.ROUTES.ADMIN_PARTY_DETAIL,
      exact: false,
    });

    const isOverview = !!matchPath(location.pathname, {
      path: ENV.ROUTES.OVERVIEW,
      exact: true,
    });

    if (isPartyDetail || isOverview) {
      dispatch(markAdminPermissionsStale());
    }
  }, [dispatch, location.pathname]);

  return (
    <ErrorBoundary>
      <Layout>
        <LoadingOverlay />
        <UserNotifyHandle />
        <UnloadEventHandler />

        <Switch>
          <Route path={ENV.ROUTES.ADMIN_PARTY_DETAIL} exact={false}>
            <RemoteRoutingAdmin store={store} theme={theme} i18n={i18n} history={history} />
          </Route>
          <Route path={ENV.ROUTES.ADMIN} exact={false}>
            <DashboardAdminPage />
          </Route>

          {buildRoutes(routes)}

          <Route path="*">
            <Redirect to={isPagoPaUser() ? ENV.ROUTES.ADMIN_SEARCH : routes.PARTY_SELECTION.path} />
          </Route>
        </Switch>
      </Layout>
    </ErrorBoundary>
  );
};

export default withLogin(App);
