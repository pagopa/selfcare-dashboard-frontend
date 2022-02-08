import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend';
import { Redirect, Route, Switch } from 'react-router';
import withLogin from '@pagopa/selfcare-common-frontend/decorators/withLogin';
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

      <Switch>
        {buildRoutes(routes)}

        <Route path="*">
          <Redirect to={routes.PARTY_SELECTION.path} />
        </Route>
      </Switch>
    </Layout>
  </ErrorBoundary>
);

export default withLogin(App);
