/* eslint-disable functional/no-let, functional/immutable-data */
import { act, render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Route, Router } from 'react-router-dom';
import { Product } from '../../model/Product';
import { buildEmptyProductRolesLists, ProductRolesLists } from '../../model/ProductRole';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { createStore } from '../../redux/store';
import { mockedParties } from '../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../services/__mocks__/productService';
import withSelectedPartyProduct from '../withSelectedPartyProduct';

const { mockedFetchRoles } = vi.hoisted(() => ({ mockedFetchRoles: vi.fn() }));

vi.mock('../../hooks/useProductRoles', () => ({
  useProductRoles: () => mockedFetchRoles,
}));

type Props = {
  products: Array<Product>;
  selectedProduct: Product;
  fetchSelectedProductRoles: (onRetry?: () => void) => Promise<ProductRolesLists>;
};

let injectedProps: Props | undefined;
const Component = (props: Props) => {
  injectedProps = props;
  return <>SELECTED {props.selectedProduct.id}</>;
};
const DecoratedComponent = withSelectedPartyProduct(Component);

const renderDecorated = (productId: string) => {
  const store = createStore();
  store.dispatch(partiesActions.setPartySelected(mockedParties[0]));
  const history = createMemoryHistory();
  history.push(`/dashboard/${mockedParties[0].partyId}/${productId}`);
  render(
    <Router history={history}>
      <Provider store={store}>
        <Route path="/dashboard/:partyId/:productId">
          <DecoratedComponent products={mockedPartyProducts} />
        </Route>
      </Provider>
    </Router>
  );
  return { store, history };
};

beforeEach(() => {
  injectedProps = undefined;
  mockedFetchRoles.mockReset();
});

describe('withSelectedPartyProduct', () => {
  test('sets displayName', () => {
    expect(DecoratedComponent.displayName).toBe('withSelectedPartyProduct(Component)');
  });

  test('injects the selected product and a roles fetcher', async () => {
    const roles = buildEmptyProductRolesLists();
    mockedFetchRoles.mockResolvedValue(roles);
    const { store } = renderDecorated(mockedPartyProducts[0].id);

    expect(screen.getByText(`SELECTED ${mockedPartyProducts[0].id}`)).toBeInTheDocument();
    expect(store.getState().appState.errors).toHaveLength(0);

    let result: ProductRolesLists | undefined;
    await act(async () => {
      result = await injectedProps!.fetchSelectedProductRoles();
    });
    expect(result).toBe(roles);
    expect(mockedFetchRoles).toHaveBeenCalledWith({
      product: mockedPartyProducts[0],
      party: store.getState().parties.selected,
    });
    expect(store.getState().appState.loading.result).toBeFalsy();
  });

  test('adds an error and returns empty roles when fetching roles fails', async () => {
    mockedFetchRoles.mockRejectedValue(new Error('roles error'));
    const onRetry = vi.fn();
    const { store } = renderDecorated(mockedPartyProducts[0].id);

    let result: ProductRolesLists | undefined;
    await act(async () => {
      result = await injectedProps!.fetchSelectedProductRoles(onRetry);
    });

    expect(result).toEqual(buildEmptyProductRolesLists());
    const error = store.getState().appState.errors[0];
    expect(error.id).toMatch(new RegExp(`^FETCH_PRODUCT_ROLES_ERROR_${mockedPartyProducts[0].id}`));
    expect(error.onRetry).toBe(onRetry);
    expect(error.toNotify).toBe(true);
  });

  test('renders nothing and adds an error redirecting to the dashboard for an invalid product', async () => {
    const { store, history } = renderDecorated('not-existing');

    expect(screen.queryByText(/SELECTED/)).not.toBeInTheDocument();
    await waitFor(() => expect(store.getState().appState.errors).toHaveLength(1));
    const error = store.getState().appState.errors[0];
    expect(error.id).toMatch(/^INVALID_PARTY_PRODUCT_ID_not-existing/);

    act(() => error.onClose?.());
    expect(history.location.pathname).toBe(`/dashboard/${mockedParties[0].partyId}`);
  });
});
