import { useTheme } from '@mui/material';
import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend/lib';
import withLogin from '@pagopa/selfcare-common-frontend/lib/decorators/withLogin';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { Redirect, Route, Switch, useHistory } from 'react-router';
import Layout from './components/Layout/Layout';
import RemoteRoutingAdmin from './microcomponents/admin/RemoteRoutingAdmin';
import DashboardAdminPage from './pages/dashboardAdmin/DasboardAdmin';
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
  // TODO fix token iss
  const isPagoPaUser = false;

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
          <Route path={ENV.ROUTES.ADMIN_SEARCH} exact={false}>
            <DashboardAdminPage />
          </Route>

          <Route exact path="/dashboard">
            <Redirect to={isPagoPaUser ? ENV.ROUTES.ADMIN_SEARCH : routes.PARTY_SELECTION.path} />
          </Route>
          {buildRoutes(routes)}

          <Route path="*">
            <Redirect to={isPagoPaUser ? ENV.ROUTES.ADMIN_SEARCH : routes.PARTY_SELECTION.path} />
          </Route>
        </Switch>
      </Layout>
    </ErrorBoundary>
  );
};

export default withLogin(App);
