import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend';
import { Redirect, Route, Switch, useHistory } from 'react-router';
import withLogin from '@pagopa/selfcare-common-frontend/decorators/withLogin';
import { useStore } from 'react-redux';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout/Layout';
import routes, { RoutesObject } from './routes';
import { ENV } from './utils/env';
import RemoteRoutingAdmin from './microcomponents/admin/RemoteRoutingAdmin';

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

  return (
    <ErrorBoundary>
      <Layout>
        <LoadingOverlay />
        <UserNotifyHandle />
        <UnloadEventHandler />

        <Switch>
          <Route path={ENV.ROUTES.ADMIN} exact={false}>
            <RemoteRoutingAdmin
              store={store}
              theme={theme}
              i18n={i18n}
              history={history}
              party={{
                partyId: '',
                externalId: '',
                originId: '',
                origin: '',
                description: '',
                digitalAddress: '',
                status: 'ACTIVE',
                userRole: 'ADMIN', // TODO New "superAdmin" selfcare role
                fiscalCode: '',
                registeredOffice: '',
                typology: '',
              }}
              products={[]}
              activeProducts={[]}
              productsMap={{}}
            />
          </Route>
          {buildRoutes(routes)}

          <Route path="*">
            <Redirect to={routes.PARTY_SELECTION.path} />
          </Route>
        </Switch>
      </Layout>
    </ErrorBoundary>
  );
};

export default withLogin(App);
