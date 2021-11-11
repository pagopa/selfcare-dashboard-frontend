import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, RootState } from '../../redux/store';
import withSelectedParty from '../withSelectedParty';
import { verifyFetchPartyDetailsMockExecution } from '../../services/__mocks__/partyService';
import { createMemoryHistory } from 'history';
import { Route, Router, Switch } from 'react-router';

jest.mock('../../services/partyService');

const expectedInstitutionId: string = '1';

let fetchPartyDetailsSpy: jest.SpyInstance;

beforeEach(() => {
  fetchPartyDetailsSpy = jest.spyOn(require('../../services/partyService'), 'fetchPartyDetails');
});

const renderApp = async (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();

  if (!injectedHistory) {
    history.push('/1');
  }

  const Component = () => <></>;
  const DecoratedComponent = withSelectedParty(Component);

  render(
    <Router history={history}>
      <Provider store={store}>
        <Switch>
          <Route path="/:institutionId">
            <DecoratedComponent />
          </Route>
        </Switch>
      </Provider>
    </Router>
  );

  await waitFor(() => expect(store.getState().parties.selected).not.toBeUndefined());

  return { store, history };
};

test('Test default behavior when no parties', async () => {
  const { store } = await renderApp();
  checkSelectedParty(store.getState());

  // test when selected party already in store
  await renderApp(store);
  checkMockInvocation(1);
});

const checkSelectedParty = (state: RootState) => {
  const party = state.parties.selected;
  verifyFetchPartyDetailsMockExecution(party);
};

const checkMockInvocation = (expectedCallsNumber: number) => {
  expect(fetchPartyDetailsSpy).toBeCalledTimes(expectedCallsNumber);
  expect(fetchPartyDetailsSpy).toBeCalledWith(expectedInstitutionId, undefined);
};
