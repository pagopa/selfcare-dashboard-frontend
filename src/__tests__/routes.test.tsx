import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router-dom';
import ROUTES, { BASE_ROUTE, DASHBOARD_ROUTES, RoutesObject } from '../routes';
import { createStore } from '../redux/store';
import { getPermissionsAdminService } from '../services/adminService';
import { renderWithProviders } from '../utils/test-utils';

vi.mock('../services/adminService', () => ({
  getPermissionsAdminService: vi.fn(),
}));

vi.mock('../microcomponents/admin/AdminRemote', () => ({
  default: () => {
    const { hasPermission } = usePermissions();
    return (
      <div>
        <h1>Dettaglio adesione</h1>
        {hasPermission('prod-io', Actions.ManageAccountPage) && <button>Approva</button>}
      </div>
    );
  },
}));

const SUBPATH_DEFAULT = (DASHBOARD_ROUTES as RoutesObject).SUBPATH_DEFAULT;

describe('routes', () => {
  test('builds the routes from BASE_ROUTE', () => {
    expect(ROUTES.PARTY_SELECTION.path).toBe(`${BASE_ROUTE}/party-selection`);
    expect(ROUTES.PARTY_DASHBOARD.path).toBe(`${BASE_ROUTE}/:partyId`);
    expect(DASHBOARD_ROUTES.DELEGATIONS.path).toBe(`${BASE_ROUTE}/:partyId/delegations`);
    expect(SUBPATH_DEFAULT.path).toBe(`${BASE_ROUTE}/:partyId/*`);
  });

  describe('standalone onboarding request permissions', () => {
    const permissionsService = vi.mocked(getPermissionsAdminService);
    const renderRequest = (store = createStore()) => {
      const history = createMemoryHistory({
        initialEntries: [`${BASE_ROUTE}/admin/onboarding/token-1`],
      });
      const RequestComponent = ROUTES.ADMIN_PARTY_DETAIL.component as React.ComponentType;
      return renderWithProviders(
        <Switch>
          <Route path={ROUTES.ADMIN_PARTY_DETAIL.path}>
            <RequestComponent />
          </Route>
        </Switch>,
        store,
        history
      );
    };

    test.each([
      ['prod-io', [Actions.ManageAccountPage], true],
      ['prod-pn', [Actions.ManageAccountPage], false],
      ['prod-io', [Actions.ViewAccountPage], false],
      ['prod-io', [], false],
    ])(
      'loads permissions on direct entry for %s with %j',
      async (productId, permissions, canManage) => {
        permissionsService.mockResolvedValueOnce({
          items: [{ productId, role: 'admin', permissions }],
        });

        const { store } = renderRequest();
        await waitFor(() => expect(store.getState().adminRoles.status).toBe('succeeded'));

        expect(screen.getByRole('heading', { name: 'Dettaglio adesione' })).toBeInTheDocument();
        expect(permissionsService).toHaveBeenCalledTimes(1);
        expect(store.getState().permissions.productPermissions).toEqual([
          { productId, actions: permissions },
        ]);
        const approveButton = screen.queryByRole('button', { name: 'Approva' });
        if (canManage) {
          expect(approveButton).toBeInTheDocument();
        } else {
          expect(approveButton).not.toBeInTheDocument();
        }
      }
    );

    test('clears stale permissions and keeps actions hidden while loading', () => {
      permissionsService.mockReturnValueOnce(new Promise(() => {}));
      const store = createStore();
      store.dispatch(
        setProductPermissions([{ productId: 'prod-io', actions: [Actions.ManageAccountPage] }])
      );

      renderRequest(store);

      expect(store.getState().adminRoles.status).toBe('pending');
      expect(store.getState().permissions.productPermissions).toEqual([]);
      expect(screen.queryByRole('button', { name: 'Approva' })).not.toBeInTheDocument();
      expect(permissionsService).toHaveBeenCalledTimes(1);
    });

    test('reports loading failures and leaves management actions hidden', async () => {
      permissionsService.mockRejectedValueOnce(new Error('permissions unavailable'));

      const { store } = renderRequest();
      await waitFor(() => expect(store.getState().adminRoles.status).toBe('failed'));

      expect(screen.queryByRole('button', { name: 'Approva' })).not.toBeInTheDocument();
      expect(store.getState().permissions.productPermissions).toEqual([]);
      expect(store.getState().appState.errors).toEqual([
        expect.objectContaining({ id: expect.stringMatching(/^getPermissionsList-api-error/) }),
      ]);
      expect(permissionsService).toHaveBeenCalledTimes(1);
    });

    test('reloads permissions with a fresh store after a page refresh', async () => {
      permissionsService.mockResolvedValue({
        items: [{ productId: 'prod-io', role: 'admin', permissions: [Actions.ManageAccountPage] }],
      });

      const first = renderRequest();
      await waitFor(() => expect(first.store.getState().adminRoles.status).toBe('succeeded'));
      cleanup();

      const refreshedStore = createStore();
      expect(refreshedStore.getState().permissions.productPermissions).toEqual([]);
      renderRequest(refreshedStore);

      await waitFor(() => expect(refreshedStore.getState().adminRoles.status).toBe('succeeded'));
      expect(screen.getByRole('button', { name: 'Approva' })).toBeInTheDocument();
      expect(permissionsService).toHaveBeenCalledTimes(2);
    });
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
