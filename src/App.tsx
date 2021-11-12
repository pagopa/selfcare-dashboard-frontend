import { Redirect, Route, Switch } from 'react-router';
import Layout from './components/Layout/Layout';
import { LoadingOverlay } from './components/Loading/LoadingOverlay';
import withLogin from './decorators/withLogin';
import routes, { RoutesObject } from './routes';

const buildRoutes = (rs: RoutesObject) =>
  Object.values(rs).map(({ path, exact, component: Component, subRoutes }, i) => (
    <Route path={path} exact={exact} key={i}>
      {Component && <Component />}
      {subRoutes && buildRoutes(subRoutes)}
    </Route>
  ));

const App = () => (
  <Layout>
    <LoadingOverlay />
    <Switch>
      {buildRoutes(routes)}

      <Route path="*">
        <Redirect to={routes.PARTY_DASHBOARD.path} />
      </Route>
    </Switch>
  </Layout>
);

export default withLogin(App);
