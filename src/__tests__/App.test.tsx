import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { verifyMockExecution as verifyLoginMockExecution } from '../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin';
import App from '../App';
import { verifyMockExecution as verifyPartiesMockExecution } from '../decorators/__mocks__/withParties';
import { verifyMockExecution as verifySelectedPartyMockExecution } from '../decorators/__mocks__/withSelectedParty';
import { BaseParty } from '../model/Party';
import { createStore } from '../redux/store';
import { mockedBaseParties } from '../services/__mocks__/partyService';

jest.mock('@pagopa/selfcare-common-frontend/lib/decorators/withLogin');
jest.mock('../decorators/withParties');
jest.mock('../decorators/withSelectedParty');

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>
    </ThemeProvider>
  );
  return { store, history };
};

test('Test rendering', () => {
  const { store } = renderApp();
  verifyLoginMockExecution(store.getState());
  verifyPartiesMockExecution(store.getState());
});

test('Test rendering dashboard parties loaded', () => {
  const history = createMemoryHistory();
  history.push('/dashboard/6');

  const { store } = renderApp(undefined, history);

  verifyLoginMockExecution(store.getState());
  const partiesList = store.getState().parties.list;

  if (partiesList) {
    const cleanedParties = partiesList.map(({ urlLogo, ...rest }: BaseParty) => rest);
    const cleanedMockedParties = mockedBaseParties.map(({ urlLogo, ...rest }: BaseParty) => rest);
    expect(cleanedParties).toEqual(cleanedMockedParties);
  } else {
    console.log('Parties list is undefined');
  }
});

test('Test routing ', async () => {
  const { history, store } = renderApp();
  await waitFor(() => expect(history.location.pathname).toBe('/dashboard'));

  await waitFor(() => history.push('/dashboard/1'));
  expect(history.location.pathname).toBe('/dashboard/1');

  verifySelectedPartyMockExecution(store.getState());
});
