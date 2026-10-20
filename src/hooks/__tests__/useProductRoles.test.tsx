/* eslint-disable functional/no-let, functional/immutable-data */
import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import type { Mock } from 'vitest';
import { Product } from '../../model/Product';
import {
  ProductRole,
  productRoles2ProductRolesList,
  ProductRolesLists,
} from '../../model/ProductRole';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { createStore } from '../../redux/store';
import { mockedParties } from '../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import { fetchProductRoles } from '../../services/productService';
import { useProductRoles } from '../useProductRoles';

vi.mock('../../services/productService', () => ({
  fetchProductRoles: vi.fn(),
}));

const mockedFetchProductRoles = fetchProductRoles as Mock;

const buildRoles = (product: Product): Array<ProductRole> => [
  {
    productId: product.id,
    partyRole: 'MANAGER',
    selcRole: 'ADMIN',
    multiroleGroups: [],
    phasesAdditionAllowed: [],
    productRole: `${product.id}-admin`,
    title: 'Admin',
    description: 'Admin role',
  } as ProductRole,
];

const renderUseProductRoles = (store: ReturnType<typeof createStore>) =>
  renderHook(() => useProductRoles(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    ),
  });

const fetchWith = async (
  fetcher: ReturnType<typeof useProductRoles>,
  product: Product
): Promise<ProductRolesLists> => {
  let roles: ProductRolesLists | undefined;
  await act(async () => {
    roles = await fetcher({ product, party: mockedParties[0] });
  });
  return roles as ProductRolesLists;
};

beforeEach(() => {
  mockedFetchProductRoles.mockReset();
  mockedFetchProductRoles.mockImplementation((product: Product) =>
    Promise.resolve(buildRoles(product))
  );
});

describe('useProductRoles', () => {
  test('fetches the roles of a product, transcodes them and caches them in redux', async () => {
    const store = createStore();
    const { result } = renderUseProductRoles(store);

    const roles = await fetchWith(result.current, mockedPartyProducts[0]);

    expect(mockedFetchProductRoles).toHaveBeenCalledWith(mockedPartyProducts[0], mockedParties[0]);
    expect(roles).toEqual(productRoles2ProductRolesList(buildRoles(mockedPartyProducts[0])));
    expect(store.getState().parties.selectedProductsRolesMap).toEqual({
      [mockedPartyProducts[0].id]: roles,
    });
  });

  test('returns the cached roles without fetching them again', async () => {
    const store = createStore();
    const cached = productRoles2ProductRolesList(buildRoles(mockedPartyProducts[0]));
    store.dispatch(
      partiesActions.setPartySelectedProductsRolesMap({ [mockedPartyProducts[0].id]: cached })
    );
    const { result } = renderUseProductRoles(store);

    const roles = await fetchWith(result.current, mockedPartyProducts[0]);

    expect(mockedFetchProductRoles).not.toHaveBeenCalled();
    expect(roles).toEqual(cached);
  });

  test('fetches only the products not yet cached and adds them to the cache', async () => {
    const store = createStore();
    const cached = productRoles2ProductRolesList(buildRoles(mockedPartyProducts[0]));
    store.dispatch(
      partiesActions.setPartySelectedProductsRolesMap({ [mockedPartyProducts[0].id]: cached })
    );
    const { result } = renderUseProductRoles(store);

    await fetchWith(result.current, mockedPartyProducts[1]);

    expect(mockedFetchProductRoles).toHaveBeenCalledTimes(1);
    expect(mockedFetchProductRoles.mock.calls[0][0]).toBe(mockedPartyProducts[1]);
    expect(Object.keys(store.getState().parties.selectedProductsRolesMap ?? {})).toEqual([
      mockedPartyProducts[0].id,
      mockedPartyProducts[1].id,
    ]);
  });

  test('propagates fetch errors without caching', async () => {
    mockedFetchProductRoles.mockRejectedValue(new Error('roles error'));
    const store = createStore();
    const { result } = renderUseProductRoles(store);

    await act(async () => {
      await expect(
        result.current({ product: mockedPartyProducts[0], party: mockedParties[0] })
      ).rejects.toThrow('roles error');
    });
    expect(store.getState().parties.selectedProductsRolesMap).toBeUndefined();
  });
});
