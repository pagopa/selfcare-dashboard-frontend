import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Route, Router, Switch } from 'react-router';
import { partiesActions } from '../../redux/slices/partiesSlice';
import { RootState, createStore } from '../../redux/store';
import {
  mockedParties,
  verifyFetchPartyDetailsMockExecution,
} from '../../services/__mocks__/partyService';
import { verifyFetchPartyProductsMockExecution } from '../../services/__mocks__/productService';
import withSelectedParty from '../withSelectedParty';

vi.mock('../../services/partyService');
vi.mock('../../services/productService');

const expectedPartyId: string = '1';

let fetchPartyDetailsSpy: vi.SpyInstance;
let fetchPartyProductsSpy: vi.SpyInstance;

beforeEach(() => {
  fetchPartyDetailsSpy = vi.spyOn(require('../../services/partyService'), 'fetchPartyDetails');
  fetchPartyProductsSpy = vi.spyOn(require('../../services/productService'), 'fetchProducts');
});

const renderApp = async (
  waitSelectedParty: boolean,
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

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
  store.dispatch(partiesActions.setPartiesList(mockedParties));
  await renderApp(false, store, history);
  history.push(`/2`);

  await waitFor(() => expect(store.getState().appState.errors.length).toBe(1));
  expect(store.getState().parties.selected).toBeUndefined();
});

const checkSelectedParty = (state: RootState) => {
  const party = state.parties.selected;
  const partyProducts = state.parties.selectedProducts;
  verifyFetchPartyDetailsMockExecution(party);
  verifyFetchPartyProductsMockExecution(partyProducts);
};

const checkMockInvocation = (expectedCallsNumber: number) => {
  expect(fetchPartyDetailsSpy).toBeCalledTimes(expectedCallsNumber);
  expect(fetchPartyDetailsSpy).toBeCalledWith(expectedPartyId);

  expect(fetchPartyProductsSpy).toBeCalledTimes(expectedCallsNumber);
  expect(fetchPartyProductsSpy).toBeCalledWith(expectedPartyId);
};
