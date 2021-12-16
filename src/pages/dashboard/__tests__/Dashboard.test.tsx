import { render, screen, waitFor,fireEvent } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { Provider } from 'react-redux';
import { createStore } from '../../../redux/store';
import { verifyMockExecution as verifySelectedPartyMockExecution } from '../../../decorators/__mocks__/withSelectedParty';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import DashboardSideMenu from '../components/dashboardSideMenu/DashboardSideMenu';
import { mockedPartyProducts } from './../../../services/__mocks__/productService';
import { mockedParties } from './../../../services/__mocks__/partyService';

jest.mock('../../../decorators/withSelectedParty');

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

const renderDashboardSideMenu = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore ? injectedStore : createStore();
  const history = injectedHistory ? injectedHistory : createMemoryHistory();
  render(
    <Router history={history}>
      <Provider store={store}>
        <Dashboard >
        <DashboardSideMenu party={mockedParties[2]} products={mockedPartyProducts}/>
        </Dashboard>
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
  renderDashboard(store, history);

  history.push('/dashboard/1');
  expect(history.location.pathname).toBe('/dashboard/1');

  history.push('/dashboard/13/2');
  await waitFor(() => expect(history.location.pathname).toBe('/dashboard/13'));

  history.push('/dashboard/13/roles');
  expect(history.location.pathname).toBe('/dashboard/13/roles');

  history.push('/dashboard/13/roles/asd');
  await waitFor(() => expect(history.location.pathname).toBe('/dashboard/13/roles'));

  history.push('/dashboard/13/prId/roles');
  expect(history.location.pathname).toBe('/dashboard/13/prId/roles');

  history.push('/dashboard/13/prId/roles/798');
  await waitFor(() => expect(history.location.pathname).toBe('/dashboard/13/prId/roles'));
});

test('Test SideMenu navigation', () => {
  const { store } = renderDashboardSideMenu();
  verifySelectedPartyMockExecution(store.getState());
  const buttonParty = screen.getByText('Gestione Ente');
  fireEvent.click(buttonParty);
  expect(screen.getAllByTestId('ExpandMoreIcon'));
  fireEvent.click(buttonParty);
  expect(screen.getAllByTestId('ExpandLessIcon'));
});
