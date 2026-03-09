import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import type { Mock } from 'vitest';
import { BaseParty, Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { RootState, createStore } from '../../redux/store';
import {
  mockedParties,
  verifyFetchPartyDetailsMockExecution,
} from '../../services/__mocks__/partyService';
import { verifyFetchPartyProductsMockExecution } from '../../services/__mocks__/productService';
import { fetchPartyDetails } from '../../services/partyService';
import { fetchProducts } from '../../services/productService';
import withSelectedParty from '../withSelectedParty';

vi.mock('../../services/partyService', () => ({
  fetchPartyDetails: vi.fn(),
}));

vi.mock('../../services/productService', () => ({
  fetchProducts: vi.fn(),
}));

const expectedPartyId: string = '1';

const mockedFetchPartyDetails = fetchPartyDetails as Mock;
const mockedFetchProducts = fetchProducts as Mock;

beforeEach(() => {
  mockedFetchPartyDetails.mockReset();
  mockedFetchProducts.mockReset();
});

const renderApp = async (
  waitSelectedParty: boolean,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ?? createStore();
  const history = injectedHistory ?? createMemoryHistory();

  if (!injectedHistory) {
    history.push(`/${expectedPartyId}`);
  }

  const Component = () => <></>;
  const DecoratedComponent = withSelectedParty(Component);

  render(
    <Router history={history}>
      <Provider store={store}>
        <Switch>
          <Route path="/:partyId">
            <DecoratedComponent />
          </Route>
        </Switch>
      </Provider>
    </Router>
  );

  if (waitSelectedParty) {
    await waitFor(() => expect(store.getState().parties.selected).not.toBeUndefined());
  }

  return { store, history };
};

test('Test default behavior when no parties', async () => {
  const { store } = await renderApp(true);
  checkSelectedParty(store.getState());

  // test when selected party already in store
  await renderApp(true, store);
});

test('Test party not active', async () => {
  const store = createStore();
  const history = createMemoryHistory();
  store.dispatch(partiesActions.setPartiesList(mockedParties as Array<BaseParty>));
  await renderApp(false, store, history);
  history.push(`/2`);

  await waitFor(() => expect(store.getState().appState.errors.length).toBe(1));
  expect(store.getState().parties.selected).toBeUndefined();
});

const checkSelectedParty = (state: RootState) => {
  const party = state.parties.selected as Party;
  const partyProducts = state.parties.selectedProducts as Array<Product>;
  verifyFetchPartyDetailsMockExecution(party);
  verifyFetchPartyProductsMockExecution(partyProducts);
};