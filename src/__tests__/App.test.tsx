import { render, waitFor } from '@testing-library/react';
import App from '../App';
import { Provider } from 'react-redux';
import { createStore } from '../redux/store';
import { verifyMockExecution as verifyLoginMockExecution } from '../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin';
import { verifyMockExecution as verifyPartiesMockExecution } from '../decorators/__mocks__/withParties';
import { verifyMockExecution as verifySelectedPartyMockExecution } from '../decorators/__mocks__/withSelectedParty';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

jest.mock('@pagopa/selfcare-common-frontend/decorators/withLogin');
jest.mock('../decorators/withParties');
jest.mock('../decorators/withSelectedParty');
jest.mock('../services/usersService');

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Router history={history}>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  );
  return { store, history };
};

test('Test rendering', () => {
  const { store } = renderApp();
  verifyLoginMockExecution(store.getState());
  verifyPartiesMockExecution(store.getState());
});

test('Test rendering dashboard no parties loaded', () => {
  const history = createMemoryHistory();
  history.push('/dashboard/1');

  const { store } = renderApp(undefined, history);

  verifyLoginMockExecution(store.getState());
  expect(store.getState().parties.list).toBeUndefined();
});

test('Test routing', async () => {
  const { history, store } = renderApp();
  expect(history.location.pathname).toBe('/dashboard');

  history.push('/dashboard/1');
  expect(history.location.pathname).toBe('/dashboard/1');

  history.push('/dashboard/13/2');
  await waitFor(() => expect(history.location.pathname).toBe('/dashboard/13'));
  verifySelectedPartyMockExecution(store.getState());
});
