import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router-dom';
import ROUTES, { BASE_ROUTE, DASHBOARD_ROUTES, RoutesObject } from '../routes';

const SUBPATH_DEFAULT = (DASHBOARD_ROUTES as RoutesObject).SUBPATH_DEFAULT;

describe('routes', () => {
  test('builds the routes from BASE_ROUTE', () => {
    expect(ROUTES.PARTY_SELECTION.path).toBe(`${BASE_ROUTE}/party-selection`);
    expect(ROUTES.PARTY_DASHBOARD.path).toBe(`${BASE_ROUTE}/:partyId`);
    expect(DASHBOARD_ROUTES.DELEGATIONS.path).toBe(`${BASE_ROUTE}/:partyId/delegations`);
    expect(SUBPATH_DEFAULT.path).toBe(`${BASE_ROUTE}/:partyId/*`);
  });

  test('SUBPATH_DEFAULT redirects unknown sub paths to the party dashboard', () => {
    const history = createMemoryHistory();
    history.push(`${BASE_ROUTE}/party-1/unknown/path`);
    const RedirectComponent = SUBPATH_DEFAULT.component as React.ComponentType;

    render(
      <Router history={history}>
        <Switch>
          <Route path={SUBPATH_DEFAULT.path}>
            <RedirectComponent />
          </Route>
        </Switch>
      </Router>
    );

    expect(history.location.pathname).toBe(`${BASE_ROUTE}/party-1`);
  });
});
