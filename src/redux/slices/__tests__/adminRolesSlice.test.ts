import {
  adminRolesReducer,
  resetAdminProductRoles,
  selectAdminRolesByProduct,
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
    });
  });

  test('setAdminProductRoles builds the roles map, unique roles and marks as succeeded', () => {
    const stale = { ...initialState, status: 'pending' as const };

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

    const state = store.getState();
    expect(selectAdminRolesByProduct(state)).toEqual({ 'prod-io': 'admin' });
    expect(selectAdminUniqueRoles(state)).toEqual(['admin']);
    expect(selectAdminRolesStatus(state)).toBe('succeeded');
  });
});
