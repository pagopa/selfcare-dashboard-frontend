import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { fireEvent, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Product } from '../../../../model/Product';
import { createStore } from '../../../../redux/store';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../utils/test-utils';
import AddDelegationPage from '../AddDelegationPage';

const formProps = vi.hoisted(() => ({ current: undefined as any }));

vi.mock('../components/AddDelegationForm', () => ({
  default: (props: any) => {
    // eslint-disable-next-line functional/immutable-data
    formProps.current = props;
    return <div data-testid="add-delegation-form" />;
  },
}));

const party = mockedParties[4];
const delegableProducts: Array<Product> = mockedPartyProducts.filter((p) => p.delegable);

const renderPage = (products: Array<Product>, permittedProductIds: Array<string>) => {
  const store = createStore();
  store.dispatch(
    setProductPermissions(
      permittedProductIds.map((productId) => ({
        productId,
        actions: [Actions.CreateDelegation],
      }))
    )
  );
  const history = createMemoryHistory();
  history.push('/previous');
  history.push('/current');
  renderWithProviders(
    <AddDelegationPage delegableProducts={products} party={party} />,
    store,
    history
  );
  return { store, history };
};

afterEach(() => {
  window.history.replaceState({}, '', '/');
});

describe('AddDelegationPage', () => {
  test('renders title and empty form props when there are no delegable products', () => {
    renderPage([], []);

    expect(screen.getAllByText('Aggiungi delega').length).toBeGreaterThan(0);
    expect(
      screen.getByText('Scegli il prodotto e indica chi potrà gestirlo per conto del tuo ente.')
    ).toBeInTheDocument();
    expect(screen.getByTestId('add-delegation-form')).toBeInTheDocument();
    expect(formProps.current.productsWithCreateDelegationAction).toEqual([]);
    expect(formProps.current.selectedProductByQuery).toBeUndefined();
    expect(formProps.current.party).toBe(party);
  });

  test('passes only products with the CreateDelegation permission to the form', () => {
    renderPage(delegableProducts, ['prod-pagopa']);

    expect(formProps.current.productsWithCreateDelegationAction.map((p: Product) => p.id)).toEqual([
      'prod-pagopa',
    ]);
    expect(formProps.current.selectedProductByQuery).toBeUndefined();
  });

  test('selects the product given in the productId query param when permitted', () => {
    window.history.replaceState({}, '', '/?productId=prod-pagopa');
    renderPage(delegableProducts, ['prod-io', 'prod-pagopa']);

    expect(formProps.current.productsWithCreateDelegationAction).toHaveLength(2);
    expect(formProps.current.selectedProductByQuery?.id).toBe('prod-pagopa');
  });

  test('ignores the productId query param when the product is not permitted', () => {
    window.history.replaceState({}, '', '/?productId=prod-pagopa');
    renderPage(delegableProducts, ['prod-io']);

    expect(formProps.current.selectedProductByQuery).toBeUndefined();
  });

  test('goes back when clicking the exit navigation button', () => {
    const { history } = renderPage(delegableProducts, []);
    expect(history.location.pathname).toBe('/current');

    fireEvent.click(screen.getByText('Esci'));

    expect(history.location.pathname).toBe('/previous');
  });
});
