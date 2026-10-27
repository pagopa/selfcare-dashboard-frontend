import useMediaQuery from '@mui/material/useMediaQuery';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { cleanup, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Mock } from 'vitest';
import {
  setAdminProductRoles,
  setAdminRolesStatus,
} from '../../../redux/slices/adminRolesSlice';
import { createStore } from '../../../redux/store';
import { getPermissionsAdminService } from '../../../services/adminService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardAdminPage from '../DasboardAdmin';

vi.mock('@mui/material/useMediaQuery');
vi.mock('../../../services/adminService', () => ({
  getPermissionsAdminService: vi.fn(),
}));

const permissionsResponse = {
  items: [
    { productId: 'prod-io', role: 'admin', permissions: ['Selc:ListAllProductUsers'] },
    { productId: 'prod-pn', role: 'operator', permissions: undefined },
    { productId: undefined, role: undefined, permissions: [] },
  ],
};

const renderAdmin = (store = createStore(), path = '/dashboard/admin/search') => {
  const history = createMemoryHistory();
  history.push(path);
  return renderWithProviders(<DashboardAdminPage />, store, history);
};

describe('DashboardAdminPage', () => {
  beforeEach(() => {
    (useMediaQuery as Mock).mockReturnValue(false);
    (getPermissionsAdminService as Mock).mockResolvedValue(permissionsResponse);
  });

  it('renders the admin remote and loads the permissions', async () => {
    const { store } = renderAdmin();

    expect(await screen.findByTestId('federation-mock')).toBeInTheDocument();
    await waitFor(() => expect(store.getState().adminRoles.status).toBe('succeeded'));

    expect(getPermissionsAdminService).toHaveBeenCalledTimes(1);
    expect(store.getState().permissions.productPermissions).toEqual([
      { productId: 'prod-io', actions: ['Selc:ListAllProductUsers'] },
      { productId: 'prod-pn', actions: [] },
      { productId: '', actions: [] },
    ]);
    expect(store.getState().adminRoles.rolesByProduct).toEqual({
      'prod-io': 'admin',
      'prod-pn': 'operator',
    });
  });

  it('renders the mobile menu when isMobile is true', async () => {
    (useMediaQuery as Mock).mockReturnValue(true);
    const { store } = renderAdmin();
    expect(screen.getByTestId('DehazeIcon')).toBeInTheDocument();
    await waitFor(() => expect(store.getState().adminRoles.status).toBe('succeeded'));
  });

  it('handles an empty response', async () => {
    (getPermissionsAdminService as Mock).mockResolvedValue({});
    const { store } = renderAdmin();
    await waitFor(() => expect(store.getState().adminRoles.status).toBe('succeeded'));
    expect(store.getState().permissions.productPermissions).toEqual([]);
  });

  it('sets the failed status and dispatches an error when loading fails', async () => {
    (getPermissionsAdminService as Mock).mockRejectedValue(new Error('boom'));
    const { store } = renderAdmin();

    await waitFor(() => expect(store.getState().adminRoles.status).toBe('failed'));
    // a failure must not trigger an endless retry loop
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(getPermissionsAdminService).toHaveBeenCalledTimes(1);
    expect(store.getState().appState.errors).toEqual([
      expect.objectContaining({ id: expect.stringMatching(/^getPermissionsList-api-error/) }),
    ]);
  });

  it('does not fetch while a request is pending', () => {
    const store = createStore();
    store.dispatch(setAdminRolesStatus('pending'));
    renderAdmin(store);
    expect(getPermissionsAdminService).not.toHaveBeenCalled();
  });

  it('replaces stale permissions left by a party page when entering the admin area', async () => {
    const store = createStore();
    store.dispatch(setProductPermissions([{ productId: 'old', actions: ['a'] }]));
    store.dispatch(setAdminProductRoles([{ productId: 'old', role: 'old-role' }]));

    renderAdmin(store);

    await waitFor(() =>
      expect(store.getState().adminRoles.rolesByProduct).toHaveProperty('prod-io')
    );
    expect(getPermissionsAdminService).toHaveBeenCalledTimes(1);
    expect(store.getState().adminRoles.rolesByProduct).not.toHaveProperty('old');
    expect(
      store.getState().permissions.productPermissions.map((p: any) => p.productId)
    ).not.toContain('old');
  });

  it('reloads the permissions every time the admin area is mounted again', async () => {
    const { store } = renderAdmin();
    await waitFor(() => expect(store.getState().adminRoles.status).toBe('succeeded'));
    cleanup();

    renderAdmin(store);
    await waitFor(() => expect(getPermissionsAdminService).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(store.getState().adminRoles.status).toBe('succeeded'));
  });
});
