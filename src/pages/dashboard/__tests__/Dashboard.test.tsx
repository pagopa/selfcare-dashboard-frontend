import { ThemeProvider } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { theme } from '@pagopa/mui-italia';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { ProductOnBoardingStatusEnum } from '../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { TypeEnum as DocumentType } from '../../../api/generated/b4f-dashboard/DocumentResource';
import { StatusEnum } from '../../../api/generated/b4f-dashboard/SubProductResource';
import { verifyMockExecution as verifySelectedPartyMockExecution } from '../../../decorators/__mocks__/withSelectedParty';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { createStore } from '../../../redux/store';
import { fetchProductsContractUpdateStatus } from '../../../services/contractUpdateService';
import { getDocumentsList } from '../../../services/documentService';
import Dashboard from '../Dashboard';
import { Mock } from 'vitest';

vi.mock('../../../decorators/withSelectedParty');
vi.mock('@mui/material/useMediaQuery');
vi.mock('../../../services/contractUpdateService', () => ({
  fetchProductsContractUpdateStatus: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../../services/documentService', () => ({
  getDocumentsList: vi.fn().mockResolvedValue([]),
  getDocument: vi.fn(),
}));
vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  isPagoPaUser: vi.fn(() => false),
}));

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

beforeEach(() => {
  vi.mocked(getDocumentsList).mockReset().mockResolvedValue([]);
  vi.mocked(fetchProductsContractUpdateStatus).mockReset().mockResolvedValue([]);
});

afterEach(() => {
  vi.mocked(isPagoPaUser).mockReturnValue(false);
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
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Provider store={store}>
          <Dashboard />
        </Provider>
      </Router>
    </ThemeProvider>
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
    buildProduct('prod-io', { delegable: true, contractEnabled: true }),
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
    permissions: Array<{ productId: string; actions: Array<string> }>,
    selectedParty = pspParty,
    catalog = products
  ) => {
    (useMediaQuery as Mock).mockReturnValue(false);
    const store = createStore();
    const history = createMemoryHistory();
    history.push(path);
    renderDashboard(store, history);
    act(() => {
      const party = {
        ...selectedParty,
        products: selectedParty.products.map((product) => ({
          ...product,
          userProductActions:
            permissions.find(({ productId }) => productId === product.productId)?.actions ?? [],
        })),
      };
      store.dispatch(partiesActions.setPartySelected(party));
      store.dispatch(partiesActions.setPartySelectedProducts(catalog));
      store.dispatch(partiesActions.setPartySelectedInstitutionTypes(['PSP']));
      store.dispatch(
        setProductPermissions(
          party.products
            .filter((product) => product.productOnBoardingStatus === 'ACTIVE')
            .map((product) => ({
              productId: product.productId ?? '',
              actions: product.userProductActions,
            }))
        )
      );
    });
    return { store, history };
  };

  test('shows invoices, delegations and managed institutions when allowed', async () => {
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
    expect(screen.queryByText('Documenti')).not.toBeInTheDocument();
    expect(screen.getByText('Deleghe')).toBeInTheDocument();
    expect(screen.getByText('Enti gestiti')).toBeInTheDocument();
    expect(getDocumentsList).not.toHaveBeenCalled();
    expect(fetchProductsContractUpdateStatus).not.toHaveBeenCalled();
  });

  test('hides the restricted sections without permissions', async () => {
    renderWithParty('/dashboard/psp1/users', []);

    expect(await screen.findByText('Panoramica')).toBeInTheDocument();
    expect(screen.queryByText('Fatturazione')).not.toBeInTheDocument();
    expect(screen.queryByText('Documenti')).not.toBeInTheDocument();
    expect(screen.queryByText('Deleghe')).not.toBeInTheDocument();
    expect(screen.queryByText('Enti gestiti')).not.toBeInTheDocument();
  });

  test.each([true, false])(
    'shows Documents with IO-only permission only for PagoPA operators (isPagoPa: %s)',
    async (isPagoPa) => {
      vi.mocked(isPagoPaUser).mockReturnValue(isPagoPa);
      renderWithParty('/dashboard/psp1/users', [
        { productId: 'prod-io', actions: ['Selc:ViewContract'] },
      ]);

      expect(await screen.findByText('Panoramica')).toBeInTheDocument();
      await waitFor(() =>
        expect(screen.queryAllByText('Documenti')).toHaveLength(isPagoPa ? 1 : 0)
      );
    }
  );

  test.each([
    ['institution document', [{ type: DocumentType.INSTITUTION }], []],
    [
      'required update',
      [],
      [{ productId: 'prod-io', contractUpdateRequired: true, contractUpdateInProgress: false }],
    ],
    [
      'in-progress update',
      [],
      [{ productId: 'prod-io', contractUpdateRequired: false, contractUpdateInProgress: true }],
    ],
  ])('shows Documents for an eligible product with %s', async (_label, documents, statuses) => {
    vi.mocked(getDocumentsList).mockResolvedValue(documents);
    vi.mocked(fetchProductsContractUpdateStatus).mockResolvedValue(statuses);
    renderWithParty('/dashboard/psp1/users', [
      { productId: 'prod-io', actions: ['Selc:ViewContract'] },
    ]);

    expect(await screen.findByText('Documenti')).toBeInTheDocument();
    expect(getDocumentsList).toHaveBeenCalledWith('psp1', 'prod-io');
    expect(getDocumentsList).not.toHaveBeenCalledWith('psp1', 'prod-pagopa');
    expect(fetchProductsContractUpdateStatus).toHaveBeenCalledWith('psp1', ['prod-io']);
  });

  test('does not show Documents for an attachment alone', async () => {
    vi.mocked(getDocumentsList).mockResolvedValue([{ type: DocumentType.ATTACHMENT }]);
    const { history } = renderWithParty('/dashboard/psp1/documents', [
      { productId: 'prod-io', actions: ['Selc:ViewContract'] },
    ]);

    await waitFor(() => expect(history.location.pathname).toBe('/dashboard/psp1'));
    expect(screen.queryByText('Documenti')).not.toBeInTheDocument();
  });

  test('ignores status for a product that was not requested', async () => {
    vi.mocked(fetchProductsContractUpdateStatus).mockResolvedValue([
      { productId: 'other', contractUpdateRequired: true, contractUpdateInProgress: false },
    ]);
    const { history } = renderWithParty('/dashboard/psp1/documents', [
      { productId: 'prod-io', actions: ['Selc:ViewContract'] },
    ]);

    await waitFor(() => expect(history.location.pathname).toBe('/dashboard/psp1'));
  });

  test('keeps access when an eligible status succeeds but a document request fails', async () => {
    vi.mocked(fetchProductsContractUpdateStatus).mockResolvedValue([
      { productId: 'prod-io', contractUpdateRequired: true, contractUpdateInProgress: false },
    ]);
    vi.mocked(getDocumentsList).mockRejectedValue(new Error('Unavailable'));
    renderWithParty('/dashboard/psp1/users', [
      { productId: 'prod-io', actions: ['Selc:ViewContract'] },
    ]);

    expect(await screen.findByText('Documenti')).toBeInTheDocument();
  });

  test('only requests enabled, onboarded products with ViewContract', async () => {
    const catalog = [
      ...products,
      buildProduct('disabled', { contractEnabled: false }),
      buildProduct('not-onboarded', { contractEnabled: true }),
      buildProduct('no-permission', { contractEnabled: true }),
    ];
    const party = {
      ...pspParty,
      products: [
        ...pspParty.products,
        { productId: 'disabled', productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE },
        { productId: 'no-permission', productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE },
      ],
    };
    renderWithParty(
      '/dashboard/psp1/users',
      ['prod-io', 'disabled', 'not-onboarded'].map((productId) => ({
        productId,
        actions: ['Selc:ViewContract'],
      })),
      party,
      catalog
    );

    await waitFor(() => expect(getDocumentsList).toHaveBeenCalledWith('psp1', 'prod-io'));
    expect(getDocumentsList).toHaveBeenCalledTimes(1);
    expect(fetchProductsContractUpdateStatus).toHaveBeenCalledWith('psp1', ['prod-io']);
  });

  test('checks both eligible parent and subproduct documents', async () => {
    const catalog = [
      buildProduct('parent', {
        contractEnabled: true,
        subProducts: [{ id: 'child', status: StatusEnum.ACTIVE, contractEnabled: true }],
      }),
    ];
    const party = {
      ...pspParty,
      products: ['parent', 'child'].map((productId) => ({
        productId,
        productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
      })),
    };
    vi.mocked(getDocumentsList).mockImplementation((_partyId, productId) =>
      Promise.resolve(productId === 'parent' ? [{ type: DocumentType.INSTITUTION }] : [])
    );
    renderWithParty(
      '/dashboard/psp1/users',
      [{ productId: 'parent', actions: ['Selc:ViewContract'] }],
      party,
      catalog
    );

    expect(await screen.findByText('Documenti')).toBeInTheDocument();
    expect(getDocumentsList).toHaveBeenCalledWith('psp1', 'parent');
    expect(getDocumentsList).toHaveBeenCalledWith('psp1', 'child');
    expect(fetchProductsContractUpdateStatus).toHaveBeenCalledWith('psp1', ['parent']);
  });

  test.each(['/dashboard/psp1/documents', '/dashboard/psp1/documents/details'])(
    'waits before redirecting an ineligible SelfCare user from %s',
    async (path) => {
      // eslint-disable-next-line functional/no-let
      let resolveDocuments!: (documents: Awaited<ReturnType<typeof getDocumentsList>>) => void;
      vi.mocked(getDocumentsList).mockReturnValue(
        new Promise((resolve) => {
          resolveDocuments = resolve;
        })
      );
      const { history } = renderWithParty(path, [
        { productId: 'prod-io', actions: ['Selc:ViewContract'] },
      ]);

      expect(await screen.findByRole('progressbar', { name: 'Documenti' })).toBeInTheDocument();
      expect(history.location.pathname).toBe(path);
      await act(async () => resolveDocuments([]));
      await waitFor(() => expect(history.location.pathname).toBe('/dashboard/psp1'));
    }
  );

  test('redirects when eligibility cannot be established', async () => {
    vi.mocked(getDocumentsList).mockRejectedValue(new Error('Unavailable'));
    const { history } = renderWithParty('/dashboard/psp1/documents', [
      { productId: 'prod-io', actions: ['Selc:ViewContract'] },
    ]);

    await waitFor(() => expect(history.location.pathname).toBe('/dashboard/psp1'));
  });

  test('waits for the selected party permissions before guarding a direct URL', async () => {
    vi.mocked(getDocumentsList).mockResolvedValue([{ type: DocumentType.INSTITUTION }]);
    const { store, history } = renderWithParty('/dashboard/psp1/users', [
      { productId: 'prod-io', actions: ['Selc:ViewContract'] },
    ]);
    await screen.findByText('Documenti');

    const permissions = store.getState().permissions.productPermissions;
    act(() => {
      store.dispatch(setProductPermissions([]));
      history.push('/dashboard/psp1/documents');
    });
    expect(screen.getByRole('progressbar', { name: 'Documenti' })).toBeInTheDocument();
    expect(history.location.pathname).toBe('/dashboard/psp1/documents');

    act(() => store.dispatch(setProductPermissions(permissions)));
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
    expect(history.location.pathname).toBe('/dashboard/psp1/documents');
  });

  test('ignores a previous party visibility response after switching party', async () => {
    // eslint-disable-next-line functional/no-let
    let resolvePrevious!: (documents: Awaited<ReturnType<typeof getDocumentsList>>) => void;
    vi.mocked(getDocumentsList).mockImplementation((partyId) =>
      partyId === 'psp1'
        ? new Promise((resolve) => {
            resolvePrevious = resolve;
          })
        : Promise.resolve([])
    );
    const { store } = renderWithParty('/dashboard/psp1/users', [
      { productId: 'prod-io', actions: ['Selc:ViewContract'] },
    ]);
    await waitFor(() => expect(getDocumentsList).toHaveBeenCalledWith('psp1', 'prod-io'));
    const selectedParty = store.getState().parties.selected!;

    act(() => {
      store.dispatch(partiesActions.setPartySelected({ ...selectedParty, partyId: 'other' }));
    });
    await waitFor(() => expect(getDocumentsList).toHaveBeenCalledWith('other', 'prod-io'));
    await act(async () => resolvePrevious([{ type: DocumentType.INSTITUTION }]));
    expect(screen.queryByText('Documenti')).not.toBeInTheDocument();
  });

  test('does not evaluate new visibility for PagoPA operators', async () => {
    vi.mocked(isPagoPaUser).mockReturnValue(true);
    renderWithParty('/dashboard/psp1/users', [
      { productId: 'prod-io', actions: ['Selc:ViewContract'] },
    ]);

    expect(await screen.findByText('Documenti')).toBeInTheDocument();
    expect(getDocumentsList).not.toHaveBeenCalled();
    expect(fetchProductsContractUpdateStatus).not.toHaveBeenCalled();
  });

  test('hides the side menu on full page flows', async () => {
    renderWithParty('/dashboard/psp1/users/add', [
      { productId: 'prod-pagopa', actions: ['Selc:ViewBilling'] },
    ]);

    expect(await screen.findByTestId('federation-mock')).toBeInTheDocument();
    expect(screen.queryByText('Panoramica')).not.toBeInTheDocument();
  });
});
