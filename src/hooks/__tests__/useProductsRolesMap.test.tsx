/* eslint-disable functional/no-let, functional/immutable-data */
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import type { Mock } from 'vitest';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import {
  ProductRole,
  productRoles2ProductRolesList,
  ProductsRolesMap,
} from '../../model/ProductRole';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { createStore } from '../../redux/store';
import { fetchProductRoles } from '../../services/productService';
import { useProductsRolesMap } from '../useProductsRolesMap';

vi.mock('../../services/productService', () => ({
  fetchProductRoles: vi.fn(),
}));

const mockedFetchProductRoles = fetchProductRoles as Mock;

const buildRole = (productId: string): ProductRole =>
  ({
    productId,
    partyRole: 'MANAGER',
    selcRole: 'ADMIN',
    multiroleGroups: [],
    phasesAdditionAllowed: [],
    productRole: `${productId}-admin`,
    title: 'Admin',
    description: 'Admin role',
  } as ProductRole);

const party = {
  partyId: 'party-1',
  products: [
    { productId: 'prod-io', productOnBoardingStatus: 'ACTIVE' },
    { productId: 'prod-pn', productOnBoardingStatus: 'ACTIVE' },
    { productId: 'prod-pagopa', productOnBoardingStatus: 'ACTIVE' },
    { productId: 'prod-interop', productOnBoardingStatus: 'PENDING' },
    { productId: 'prod-noperm', productOnBoardingStatus: 'ACTIVE' },
  ],
} as unknown as Party;

const products = [
  'prod-io',
  'prod-pn',
  'prod-pagopa',
  'prod-interop',
  'prod-noperm',
  'prod-not-onboarded',
].map((id) => ({ id } as Product));

const setupStore = (opts: { withParty?: boolean; withProducts?: boolean } = {}) => {
  const store = createStore();
  if (opts.withParty ?? true) {
    store.dispatch(partiesActions.setPartySelected(party));
  }
  if (opts.withProducts ?? true) {
    store.dispatch(partiesActions.setPartySelectedProducts(products));
  }
  store.dispatch(
    setProductPermissions([
      { productId: 'prod-io', actions: [Actions.AccessProductBackoffice] },
      { productId: 'prod-pn', actions: [Actions.AccessProductBackofficeAdmin] },
      { productId: 'prod-pagopa', actions: [Actions.AccessProductBackoffice] },
      { productId: 'prod-interop', actions: [Actions.AccessProductBackoffice] },
      { productId: 'prod-noperm', actions: [Actions.ListProductUsers] },
    ])
  );
  return store;
};

const renderUseProductsRolesMap = (store: ReturnType<typeof createStore>) =>
  renderHook(() => useProductsRolesMap(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  });

beforeEach(() => {
  mockedFetchProductRoles.mockReset();
  mockedFetchProductRoles.mockImplementation((p: Product) => Promise.resolve([buildRole(p.id)]));
});

describe('useProductsRolesMap', () => {
  test('returns the stored (empty) map when no products are selected', async () => {
    const store = setupStore({ withProducts: false });
    const { result } = renderUseProductsRolesMap(store);

    let map: ProductsRolesMap | undefined;
    await act(async () => {
      map = await result.current();
    });

    expect(map).toEqual({});
    expect(mockedFetchProductRoles).not.toHaveBeenCalled();
    expect(store.getState().parties.selectedProductsRolesMap).toEqual({});
  });

  test('fetches roles only for active products with backoffice permission and stores them', async () => {
    const store = setupStore();
    const { result } = renderUseProductsRolesMap(store);

    let map: ProductsRolesMap = {};
    await act(async () => {
      map = await result.current();
    });

    expect(mockedFetchProductRoles).toHaveBeenCalledTimes(3);
    expect(mockedFetchProductRoles.mock.calls.map((c) => c[0].id)).toEqual([
      'prod-io',
      'prod-pn',
      'prod-pagopa',
    ]);
    mockedFetchProductRoles.mock.calls.forEach((c) => expect(c[1]).toEqual(party));
    expect(Object.keys(map)).toEqual(['prod-io', 'prod-pn', 'prod-pagopa']);
    expect(map['prod-io']).toEqual(productRoles2ProductRolesList([buildRole('prod-io')]));
    expect(store.getState().parties.selectedProductsRolesMap).toEqual(map);
  });

  test('returns cached roles without fetching when every accessible product is already cached', async () => {
    const store = setupStore();
    const cached: ProductsRolesMap = {
      'prod-io': productRoles2ProductRolesList([buildRole('prod-io')]),
      'prod-pn': productRoles2ProductRolesList([buildRole('prod-pn')]),
    };
    store.dispatch(
      partiesActions.setPartySelectedProducts(products.filter((p) => p.id !== 'prod-pagopa'))
    );
    store.dispatch(partiesActions.setPartySelectedProductsRolesMap(cached));
    const { result } = renderUseProductsRolesMap(store);

    let map: ProductsRolesMap = {};
    await act(async () => {
      map = await result.current();
    });

    expect(mockedFetchProductRoles).not.toHaveBeenCalled();
    expect(map).toEqual(cached);
  });

  test('fetches only the products not yet cached and merges them with the cached ones', async () => {
    const store = setupStore();
    const cachedIo = productRoles2ProductRolesList([buildRole('prod-io')]);
    store.dispatch(partiesActions.setPartySelectedProductsRolesMap({ 'prod-io': cachedIo }));
    const { result } = renderUseProductsRolesMap(store);

    let map: ProductsRolesMap = {};
    await act(async () => {
      map = await result.current();
    });

    expect(mockedFetchProductRoles.mock.calls.map((c) => c[0].id)).toEqual([
      'prod-pn',
      'prod-pagopa',
    ]);
    expect(map['prod-io']).toBe(cachedIo);
    expect(Object.keys(map).sort()).toEqual(['prod-io', 'prod-pagopa', 'prod-pn']);
  });

  test('always refetches every accessible product when prod-pagopa roles are cached', async () => {
    const store = setupStore();
    const cached: ProductsRolesMap = {
      'prod-io': productRoles2ProductRolesList([]),
      'prod-pn': productRoles2ProductRolesList([]),
      'prod-pagopa': productRoles2ProductRolesList([]),
    };
    store.dispatch(partiesActions.setPartySelectedProductsRolesMap(cached));
    const { result } = renderUseProductsRolesMap(store);

    let map: ProductsRolesMap = {};
    await act(async () => {
      map = await result.current();
    });

    expect(mockedFetchProductRoles).toHaveBeenCalledTimes(3);
    expect(map['prod-pagopa'].list).toEqual([buildRole('prod-pagopa')]);
  });

  test('filters out every product when there is no selected party', async () => {
    const store = setupStore({ withParty: false });
    const { result } = renderUseProductsRolesMap(store);

    let map: ProductsRolesMap | undefined;
    await act(async () => {
      map = await result.current();
    });

    expect(mockedFetchProductRoles).not.toHaveBeenCalled();
    expect(map).toEqual({});
  });
});
