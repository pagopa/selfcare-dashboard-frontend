import useMediaQuery from '@mui/material/useMediaQuery';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ProductOnBoardingStatusEnum } from '../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { StatusEnum } from '../../../api/generated/b4f-dashboard/SubProductResource';
import { verifyMockExecution as verifySelectedPartyMockExecution } from '../../../decorators/__mocks__/withSelectedParty';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { partiesActions } from '../../../redux/slices/partiesSlice';
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

describe('Dashboard side menu visibility', () => {
  const buildProduct = (id: string, overrides: Partial<Product> = {}): Product => ({
    id,
    title: `Title ${id}`,
    description: '',
    logo: '',
    urlBO: '',
    status: StatusEnum.ACTIVE,
    imageUrl: '',
    delegable: false,
    ...overrides,
  });

  const products: Array<Product> = [
    buildProduct('prod-pagopa', { invoiceable: true, delegable: true }),
    buildProduct('prod-io', { delegable: true }),
  ];

  const pspParty: Party = {
    partyId: 'psp1',
    description: 'PSP Test',
    registeredOffice: '',
    typology: 'PSP',
    delegation: true,
    products: [
      {
        productId: 'prod-pagopa',
        productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
        institutionType: 'PSP',
        isAggregator: true,
      },
      { productId: 'prod-io', productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE },
    ],
  };

  const renderWithParty = (
    path: string,
    permissions: Array<{ productId: string; actions: Array<string> }>
  ) => {
    (useMediaQuery as Mock).mockReturnValue(false);
    const store = createStore();
    const history = createMemoryHistory();
    history.push(path);
    renderDashboard(store, history);
    act(() => {
      store.dispatch(partiesActions.setPartySelected(pspParty));
      store.dispatch(partiesActions.setPartySelectedProducts(products));
      store.dispatch(partiesActions.setPartySelectedInstitutionTypes(['PSP']));
      store.dispatch(setProductPermissions(permissions));
    });
    return { store, history };
  };

  test('shows invoices, documents, delegations and managed institutions when allowed', async () => {
    renderWithParty('/dashboard/psp1/users', [
      {
        productId: 'prod-pagopa',
        actions: [
          'Selc:ViewBilling',
          'Selc:ViewContract',
          'Selc:ViewManagedInstitutions',
          'Selc:ViewDelegations',
        ],
      },
    ]);

    expect(await screen.findByText('Fatturazione')).toBeInTheDocument();
    expect(screen.getByText('Documenti')).toBeInTheDocument();
    expect(screen.getByText('Deleghe')).toBeInTheDocument();
    expect(screen.getByText('Enti gestiti')).toBeInTheDocument();
  });

  test('hides the restricted sections without permissions', async () => {
    renderWithParty('/dashboard/psp1/users', []);

    expect(await screen.findByText('Panoramica')).toBeInTheDocument();
    expect(screen.queryByText('Fatturazione')).not.toBeInTheDocument();
    expect(screen.queryByText('Documenti')).not.toBeInTheDocument();
    expect(screen.queryByText('Deleghe')).not.toBeInTheDocument();
    expect(screen.queryByText('Enti gestiti')).not.toBeInTheDocument();
  });

  test('hides the side menu on full page flows', async () => {
    renderWithParty('/dashboard/psp1/users/add', [
      { productId: 'prod-pagopa', actions: ['Selc:ViewBilling'] },
    ]);

    expect(await screen.findByTestId('federation-mock')).toBeInTheDocument();
    expect(screen.queryByText('Panoramica')).not.toBeInTheDocument();
  });
});
