import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { Party } from '../model/Party';
import { createStore } from '../redux/store';

export const renderWithProviders = (
  component: React.ReactElement,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore || createStore();
  const history = injectedHistory || createMemoryHistory();

  render(
    <Router history={history}>
      <Provider store={store}>{component}</Provider>
    </Router>
  );
  return { store, history };
};

/**
 * Sets product permissions for a given party in the provided Redux store.
 * @param store - The Redux store from renderWithProviders
 * @param party - The party whose products will be used to set permissions
 * @param filterFn - Optional custom filter function for products (default: ACTIVE)
 */
export function setPermissionsForParty(
  store: ReturnType<typeof createStore>,
  party: Party,
  filterFn: (product: (typeof party.products)[number]) => boolean = (p) =>
    p.productOnBoardingStatus === 'ACTIVE'
) {
  const mockedActions = party.products.filter(filterFn).map((product) => ({
    productId: product.productId ?? '',
    actions: product.userProductActions ? [...product.userProductActions] : [],
  }));

  store.dispatch(setProductPermissions(mockedActions));
}
