import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia';
import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { Mock } from 'vitest';
import App from '../App';
import {
  verifyMockExecution as verifyLoginMockExecution,
} from '../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin';
import {
  verifyMockExecution as verifyPartiesMockExecution,
} from '../decorators/__mocks__/withParties';
import { verifyMockExecution as verifySelectedPartyMockExecution } from '../decorators/__mocks__/withSelectedParty';
import { useIsPagoPaUser } from '../hooks/useIsPagoPaUser';
import { BaseParty } from '../model/Party';
import { createStore } from '../redux/store';
import { getPermissionsAdminService } from '../services/adminService';
import { mockedBaseParties } from '../services/__mocks__/partyService';

vi.mock('@pagopa/selfcare-common-frontend/lib/decorators/withLogin', async () => {
  const actual = await vi.importActual('../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin');
  return {
    default: (actual as any).default,
    __esModule: true,
  };
});
vi.mock('../decorators/withParties');
vi.mock('../decorators/withSelectedParty');
vi.mock('../hooks/useIsPagoPaUser', () => ({ useIsPagoPaUser: vi.fn(() => false) }));
vi.mock('../services/adminService', () => ({
  getPermissionsAdminService: vi.fn(() => Promise.resolve({ items: [] })),
}));

const renderApp = (
  injectedStore?: ReturnType<typeof createStore>,
  injectedHistory?: ReturnType<typeof createMemoryHistory>
) => {
  const store = injectedStore || createStore();
  const history = injectedHistory || createMemoryHistory();
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

  await waitFor(() => expect(history.location.pathname).toBe('/dashboard/party-selection'));

  await waitFor(() => history.push('/dashboard/1'));
  expect(history.location.pathname).toBe('/dashboard/1');

  verifySelectedPartyMockExecution(store.getState());
});

describe('PagoPA admin routes', () => {
  beforeEach(() => {
    (useIsPagoPaUser as Mock).mockReturnValue(true);
  });

  afterEach(() => {
    (useIsPagoPaUser as Mock).mockReturnValue(false);
  });

  test('redirects unknown paths to the admin search', async () => {
    const history = createMemoryHistory();
    history.push('/unknown');
    renderApp(undefined, history);

    await waitFor(() => expect(history.location.pathname).toBe('/dashboard/admin/search'));
  });

  test('renders the admin area inside the dashboard shell and loads the admin permissions', async () => {
    const history = createMemoryHistory();
    history.push('/dashboard/admin/search');
    const { store } = renderApp(undefined, history);

    expect(await screen.findByTestId('federation-mock')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    await waitFor(() => expect(store.getState().adminRoles.status).toBe('succeeded'));
    expect(getPermissionsAdminService).toHaveBeenCalled();
    expect(store.getState().parties.selected).toBeUndefined();
  });

  test('renders the onboarding detail full page without reloading the admin permissions', async () => {
    (getPermissionsAdminService as Mock).mockClear();
    const history = createMemoryHistory();
    history.push('/dashboard/admin/onboarding/token-1');
    renderApp(undefined, history);

    expect(await screen.findByTestId('federation-mock')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(getPermissionsAdminService).not.toHaveBeenCalled();
  });
});
