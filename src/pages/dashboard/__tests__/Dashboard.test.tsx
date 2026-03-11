import useMediaQuery from '@mui/material/useMediaQuery';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { verifyMockExecution as verifySelectedPartyMockExecution } from '../../../decorators/__mocks__/withSelectedParty';
import { createStore } from '../../../redux/store';
import Dashboard from '../Dashboard';
import { Mock } from 'vitest';

vi.mock('../../../decorators/withSelectedParty');
vi.mock('@mui/material/useMediaQuery');

const oldWindowLocation = global.window.location;
const mockedLocation = {
  assign: vi.fn(),
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

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

const renderDashboard = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore || createStore();
  const history = injectedHistory || createMemoryHistory();
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
  //const store = createStore();
  const history = createMemoryHistory();
  history.push('/dashboard');
  waitFor(() => renderDashboard());

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

  history.push('/dashboard/4');

  history.push('/dashboard/3');

  // history.push('/dashboard/13/prId/users/798');
  // await waitFor(() => expect(history.location.pathname).toBe('/dashboard/13/prId/users'));
});

test('Test rendering on mobile', async () => {
  const user = userEvent.setup();
  (useMediaQuery as Mock).mockReturnValue(true);

  renderDashboard();

  const overviewButton = await screen.findByText('Panoramica');
  await user.click(overviewButton);

  const drawer = await screen.findByRole('presentation');
  expect(drawer).toBeInTheDocument();

  await user.click(drawer);

  const drawerNav = within(drawer).getByRole('navigation');

  const overviewButtonInDrawer = within(drawerNav).getByText('Panoramica');
  await user.click(overviewButtonInDrawer);

  await user.keyboard('{Escape}');

  await waitFor(() => {
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });
});

test('Test rendering on desktop', async () => {
  const user = userEvent.setup();
  (useMediaQuery as Mock).mockReturnValue(false);

  renderDashboard();

  const sideBarCloseIcon = await screen.findByTestId('DehazeIcon');

  await user.click(sideBarCloseIcon);
});
