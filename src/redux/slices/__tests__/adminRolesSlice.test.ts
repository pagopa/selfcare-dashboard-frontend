import {
  adminRolesReducer,
  markAdminPermissionsStale,
  resetAdminProductRoles,
  selectAdminRolesByProduct,
  selectAdminRolesNeedsReload,
  selectAdminRolesStatus,
  selectAdminUniqueRoles,
  setAdminProductRoles,
  setAdminRolesStatus,
} from '../adminRolesSlice';
import { createStore } from '../../store';

const initialState = adminRolesReducer(undefined, { type: '@@INIT' });

describe('adminRolesSlice', () => {
  test('has the expected initial state', () => {
    expect(initialState).toEqual({
      rolesByProduct: {},
      uniqueRoles: [],
      status: 'idle',
      needsReload: false,
    });
  });

  test('setAdminProductRoles builds the roles map, unique roles and marks as succeeded', () => {
    const stale = { ...initialState, needsReload: true, status: 'pending' as const };

    const state = adminRolesReducer(
      stale,
      setAdminProductRoles([
        { productId: 'prod-io', role: 'admin' },
        { productId: 'prod-pn', role: 'admin' },
        { productId: 'prod-pagopa', role: 'operator' },
        { productId: 'prod-empty' },
        { productId: '', role: 'ignored' },
      ])
    );

    expect(state).toEqual({
      rolesByProduct: {
        'prod-io': 'admin',
        'prod-pn': 'admin',
        'prod-pagopa': 'operator',
        'prod-empty': '',
      },
      uniqueRoles: ['admin', 'operator'],
      status: 'succeeded',
      needsReload: false,
    });
  });

  test('setAdminProductRoles handles a missing payload', () => {
    const state = adminRolesReducer(initialState, setAdminProductRoles(undefined as any));

    expect(state.rolesByProduct).toEqual({});
    expect(state.uniqueRoles).toEqual([]);
    expect(state.status).toBe('succeeded');
  });

  test('setAdminProductRoles keeps the last role seen for duplicated products', () => {
    const state = adminRolesReducer(
      initialState,
      setAdminProductRoles([
        { productId: 'prod-io', role: 'operator' },
        { productId: 'prod-io', role: 'admin' },
      ])
    );

    expect(state.rolesByProduct).toEqual({ 'prod-io': 'admin' });
    expect(state.uniqueRoles).toEqual(['admin']);
  });

  test('setAdminRolesStatus updates only the status', () => {
    const state = adminRolesReducer(initialState, setAdminRolesStatus('failed'));
    expect(state).toEqual({ ...initialState, status: 'failed' });
  });

  test('markAdminPermissionsStale sets needsReload', () => {
    const state = adminRolesReducer(initialState, markAdminPermissionsStale());
    expect(state.needsReload).toBe(true);
  });

  test('resetAdminProductRoles restores the initial state', () => {
    const populated = adminRolesReducer(
      initialState,
      setAdminProductRoles([{ productId: 'prod-io', role: 'admin' }])
    );
    expect(adminRolesReducer(populated, resetAdminProductRoles())).toEqual(initialState);
  });

  test('selectors read from the store', () => {
    const store = createStore();
    store.dispatch(setAdminProductRoles([{ productId: 'prod-io', role: 'admin' }]));
    store.dispatch(markAdminPermissionsStale());

    const state = store.getState();
    expect(selectAdminRolesByProduct(state)).toEqual({ 'prod-io': 'admin' });
    expect(selectAdminUniqueRoles(state)).toEqual(['admin']);
    expect(selectAdminRolesStatus(state)).toBe('succeeded');
    expect(selectAdminRolesNeedsReload(state)).toBe(true);
  });
});
