import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import { verifyMockExecution as verifySelectedPartyMockExecution } from '../../../decorators/__mocks__/withSelectedParty';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';

jest.mock('../../../decorators/withSelectedParty');

const oldWindowLocation = global.window.location;
const mockedLocation = {
  assign: jest.fn(),
  pathname: '',
  origin: 'MOCKED_ORIGIN',
  search: '',
  hash: '',
};

beforeAll(() => {
  Object.defineProperty(window, 'location', { value: mockedLocation });
});
afterAll(() => {
  Object.defineProperty(window, 'location', { value: oldWindowLocation });
});

const renderDashboard = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Router history={history}>
      <Provider store={store}>
        <Dashboard />
      </Provider>
    </Router>
  );
  return { store, history };
};

test('Test rendering', () => {
  const { store } = renderDashboard();
  verifySelectedPartyMockExecution(store.getState());
});

test('Test routing', async () => {
  const store = createStore();
  const history = createMemoryHistory();
  history.push('/dashboard');
  waitFor(() => renderDashboard(store, history));

  history.push('/dashboard/1');
  expect(history.location.pathname).toBe('/dashboard/1');

  history.push('/dashboard/13/users');
  expect(history.location.pathname).toBe('/dashboard/13/users');

  // history.push('/dashboard/13/users/asd');
  // await waitFor(() => expect(history.location.pathname).toBe('/dashboard/13/users'));
  history.push('/dashboard/13/prId/users');
  expect(history.location.pathname).toBe('/dashboard/13/prId/users');

  history.push('/dashboard/3/delegates');
  expect(history.location.pathname).toBe('/dashboard/3/delegates');

  const InvoiceBtn = screen.getByText('Fatturazione');

  // Operator with user role in prod-pn see Invoice
  history.push('/dashboard/4');
  expect(InvoiceBtn).toBeInTheDocument();

  // Admin with user role in prod-pn see Invoice
  history.push('/dashboard/3');
  expect(InvoiceBtn).toBeInTheDocument();

  await waitFor(() => fireEvent.click(InvoiceBtn));

  // history.push('/dashboard/13/prId/users/798');
  // await waitFor(() => expect(history.location.pathname).toBe('/dashboard/13/prId/users'));
});
