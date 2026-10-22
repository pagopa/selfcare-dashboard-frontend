import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend/lib';
import withLogin from '@pagopa/selfcare-common-frontend/lib/decorators/withLogin';
import { Route, Switch } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import routes, { RoutesObject } from './routes';

const buildRoutes = (rs: RoutesObject) =>
  Object.values(rs).map(({ path, exact, component: Component, subRoutes }, i) => (
    <Route path={path} exact={exact} key={i}>
      {Component && <Component />}
      {subRoutes && <Switch>{buildRoutes(subRoutes)}</Switch>}
    </Route>
  ));

const App = () => (
  <ErrorBoundary>
    <Layout>
      <LoadingOverlay />
      <UserNotifyHandle />
      <UnloadEventHandler />

      <Switch>{buildRoutes(routes)}</Switch>
    </Layout>
  </ErrorBoundary>
);

export default withLogin(App);
