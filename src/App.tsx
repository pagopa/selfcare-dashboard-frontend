<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Party } from './model/Party';

import Layout from './components/Layout/Layout';
import theme from './theme';
import CardUser from './pages/CardUser';

export function App() {
  const party: Party = {
    role: 'Manager',
    description: 'Comune di Milano',
    image: 'image',
    status: 'Pending',
    institutionId: '1',
    attributes: ['Ente Locale'],
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <CardUser party={party} />
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}
=======
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
        <Redirect to={routes.PARTY_SELECTION.path} />
      </Route>
    </Switch>
  </Layout>
);

export default withLogin(App);
>>>>>>> origin/release-dev
