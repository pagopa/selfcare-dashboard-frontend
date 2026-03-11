import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { createStore } from '../../redux/store';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import withProductsRolesMap from '../withProductsRolesMap';
import { fetchProductRoles } from '../../services/productService';
import type { Mock } from 'vitest';

vi.mock('../../services/productService', () => ({
  fetchProductRoles: vi.fn(),
}));

const mockedFetchProductRoles = fetchProductRoles as Mock;

const renderApp = (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore || createStore();
  const Component = () => <>RENDERED</>;
  const DecoratedComponent = withProductsRolesMap(Component);

  render(
    <Provider store={store}>
      <DecoratedComponent />
    </Provider>
  );

  return store;
};

beforeEach(() => {
  mockedFetchProductRoles.mockReset();
});

test.skip('Test', async () => {
  const store = renderApp();
  await waitFor(() => screen.getByText('RENDERED'));
  await checkProductsRolesMapLength(0, store);

  store.dispatch(
    partiesActions.setPartySelectedProducts(
      mockedPartyProducts.filter((p) => p.status === 'ACTIVE').slice(0, 1)
    )
  );
  renderApp(store);
  await waitFor(() => expect(screen.getAllByText('RENDERED').length).toBe(2));
  await checkProductsRolesMapLength(1, store);

  store.dispatch(partiesActions.setPartySelectedProducts(mockedPartyProducts));
  renderApp(store);
  await waitFor(() => expect(screen.getAllByText('RENDERED').length).toBe(2));
  await checkProductsRolesMapLength(
    mockedPartyProducts.filter((p) => p.status === 'ACTIVE').length,
    store
  );

  expect(mockedFetchProductRoles).toBeCalledTimes(
    mockedPartyProducts.filter((p) => p.status === 'ACTIVE').length
  );
});

const checkProductsRolesMapLength = async (
  expectedProductCached: number,
  store: ReturnType<typeof createStore>
) => {
  await waitFor(() =>
    expect(Object.keys(store.getState().parties.selectedProductsRolesMap || {}).length).toBe(
      expectedProductCached
    )
  );
};
