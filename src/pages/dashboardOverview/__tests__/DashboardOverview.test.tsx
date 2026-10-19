import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Mock } from 'vitest';
import { DashboardApi } from '../../../api/DashboardApiClient';
import { UploadIcon } from '../../../assets/icons/UploadIcon';
import { useLogoExists } from '../../../hooks/useLogoExist';
import '../../../locale';
import { BaseParty, Party } from '../../../model/Party';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { store } from '../../../redux/store';
import { COMMON_ADMIN_ACTIONS, mockedParties } from '../../../services/__mocks__/partyService';
import { mockedCategories, mockedPartyProducts } from '../../../services/__mocks__/productService';
import { createStore } from '../../../redux/store';
import { renderWithProviders, setPermissionsForParty } from '../../../utils/test-utils';
import DashboardOverview from '../DashboardOverview';

vi.mock('../../../hooks/useLogoExist', () => ({ useLogoExists: vi.fn(() => true) }));
vi.mock('../../../api/DashboardApiClient', () => ({
  DashboardApi: {
    updateInstitutionGeographicTaxonomy: vi.fn(() => Promise.resolve()),
    getUserOtpEmailInfo: vi.fn(() => Promise.resolve({})),
    getAttachmentStatus: vi.fn(() => Promise.resolve({ isAttachmentAvailable: true })),
    uploadLogo: vi.fn(() => Promise.resolve(true)),
  },
}));

const renderOverview = (
  party: Party,
  permissions: Array<{ productId: string; actions: Array<string> }>,
  institutionTypes: Array<string> = ['PA']
) => {
  const store = createStore();
  store.dispatch(setProductPermissions(permissions));
  store.dispatch(partiesActions.setPartySelectedInstitutionTypes(institutionTypes));
  store.dispatch(partiesActions.setPartySelected(party));
  store.dispatch(partiesActions.setPartiesList(mockedParties as Array<BaseParty>));
  return renderWithProviders(
    <DashboardOverview party={party} products={mockedPartyProducts} />,
    store
  );
};

test('should render component DashboardOverview with empty party', async () => {
  renderWithProviders(
    <DashboardOverview
      party={{
        partyId: '',
        products: [],
        externalId: undefined,
        originId: undefined,
        origin: undefined,
        description: '',
        digitalAddress: undefined,
        category: undefined,
        urlLogo: undefined,
        fiscalCode: undefined,
        registeredOffice: '',
        zipCode: '',
        typology: '',
        institutionType: undefined,
        recipientCode: undefined,
        geographicTaxonomies: [],
        vatNumberGroup: undefined,
        supportEmail: undefined,
        vatNumber: undefined,
        subunitCode: undefined,
        subunitType: undefined,
        aooParentCode: undefined,
        parentDescription: undefined,
        userRole: undefined,
        status: undefined,
      }}
      products={[]}
    />
  );

  // info section is not visible
  // expect(screen.queryByTestId('InfoOutlinedIcon')).not.toBeInTheDocument();
});

test('should render component DashboardOverview with populated props and product prod-pagopa and institutionType GSP', async () => {
  const mockedGsp = mockedParties[11];
  renderWithProviders(<DashboardOverview party={mockedGsp} products={mockedPartyProducts} />);

  const partyDetailModal = await screen.findByText('Gestisci i dati dell’ente');

  fireEvent.click(partyDetailModal);

  // info section is not visible
  // expect(screen.queryByTestId('InfoOutlinedIcon')).not.toBeInTheDocument();
});

test('should render component DashboardOverview with institutionType SA and Product Avaible section should not be visible', async () => {
  const mockedSa = mockedParties[17];
  renderWithProviders(<DashboardOverview party={mockedSa} products={mockedPartyProducts} />);

  // Avaible products section is not visible for SA
  expect(screen.queryByText('Prodotti disponibili')).not.toBeInTheDocument();
});

test('should render component DashboardOverview with institutionType AS and Product Available section should not be visible', async () => {
  const mockedInsuranceCompany = mockedParties[18];
  renderWithProviders(
    <DashboardOverview party={mockedInsuranceCompany} products={mockedPartyProducts} />
  );

  const addMobilePhoneButton = screen.queryByText('Aggiungi');

  expect(addMobilePhoneButton).not.toBeInTheDocument();

  // Avaible products section is not visible for AS
  expect(screen.queryByText('Prodotti disponibili')).not.toBeInTheDocument();
});

test('should render component DashboardOverview with no geoTaxonomy', async () => {
  const mockedPAWithNoGeoTax = mockedParties[0];

  store.dispatch(partiesActions.setPartySelectedInstitutionTypes(['PA', 'GSP']));
  setPermissionsForParty(store, mockedPAWithNoGeoTax);

  renderWithProviders(
    <DashboardOverview party={mockedPAWithNoGeoTax} products={mockedPartyProducts} />,
    store
  );

  // geo tax modal is visile bc mockedPAWithNoGeoTax has no geoTaxonomies and has action UpdateGeoTaxonomies
  const partyDetailModal = await screen.findByText('Gestisci i dati dell’ente');

  fireEvent.click(partyDetailModal);

  const geoTaxModal = await screen.findByText('Nazionale');

  fireEvent.click(geoTaxModal);

  const addButtons = await screen.findAllByText('Aggiungi');

  const modifyButton = addButtons[0];

  expect(modifyButton).toBeInTheDocument();
  fireEvent.click(modifyButton);
  // the click saves the geographic taxonomies; wait for the request so its .finally runs inside the test
  await waitFor(() =>
    expect(DashboardApi.updateInstitutionGeographicTaxonomy).toHaveBeenCalled()
  );
});

test('should render component DashboardOverview with geoTaxonomy', async () => {
  const mockedPAWithGeoTax = mockedParties[2];

  renderWithProviders(
    <DashboardOverview party={mockedPAWithGeoTax} products={mockedPartyProducts} />
  );

  const partyDetailModal = await screen.findByText('Gestisci i dati dell’ente');

  fireEvent.click(partyDetailModal);

  const closeModal = await screen.findByTestId('close-modal-test');

  fireEvent.click(closeModal);
});

test('should render banner DORA for PSP for product pagoPA', async () => {
  const mockedPSPwithPagoPA = mockedParties.find(
    (party) => party.description === 'Prova PSP'
  ) as Party;

  const { store } = renderWithProviders(
    <DashboardOverview party={mockedPSPwithPagoPA} products={mockedPartyProducts} />
  );
  act(() => {
    store.dispatch(
      setProductPermissions([
        {
          productId: 'prod-pagopa',
          actions: COMMON_ADMIN_ACTIONS,
        },
      ])
    );
  });

  const bannerDORATitle = await screen.findByText('Nuovo addendum DORA');
  expect(bannerDORATitle).toBeInTheDocument();

  const downloadButton = await screen.findByText('Scarica il documento');
  expect(downloadButton).toBeInTheDocument();

  fireEvent.click(downloadButton);
});

describe('DashboardOverview banners and modals', () => {
  const usersPermission = { productId: 'prod-io', actions: [Actions.UpdateProductUsers] };

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  test('shows the PEC OTP banner for the reference institution and navigates to the user edit page', async () => {
    const onboardedParty = mockedParties.find((p) => p.partyId === 'onboarded') as Party;
    const { history } = renderOverview(onboardedParty, [usersPermission]);

    expect(await screen.findByText('Modifica email')).toBeInTheDocument();
    expect(screen.queryByText('Cambia ente')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Modifica email'));
    expect(history.location.pathname).toContain('/onboarded/users/mockUserId/edit');
  });

  test('shows the banner to switch to the PEC reference institution', async () => {
    const assignMock = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign: assignMock });
    renderOverview(mockedParties[0], [usersPermission]);

    expect(await screen.findByText('Cambia ente')).toBeInTheDocument();
    expect(screen.getByText(/per l’ente AGENCY ONBOARDED/)).toBeInTheDocument();
    expect(screen.queryByText('Modifica email')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Cambia ente'));
    expect(assignMock).toHaveBeenCalledWith('/dashboard/onboarded');
  });

  test('does not show PEC banners without users management permission', () => {
    renderOverview(mockedParties[0], []);

    expect(screen.queryByText('Cambia ente')).not.toBeInTheDocument();
    expect(screen.queryByText('Modifica email')).not.toBeInTheDocument();
  });

  test('shows the SEND logo upload banner when the logo is missing and opens the detail modal', async () => {
    (useLogoExists as Mock).mockReturnValue(false);
    renderOverview(mockedParties[0], [{ productId: 'prod-pn', actions: [Actions.UploadLogo] }]);

    fireEvent.click(screen.getByRole('button', { name: 'Carica logo' }));
    expect(
      await screen.findByRole('heading', { name: 'Gestisci i dati dell’ente' })
    ).toBeInTheDocument();
    expect(screen.getAllByText('consulta le linee guida').length).toBeGreaterThan(0);
  });

  test('saves the geographic taxonomies chosen in the first time modal', async () => {
    const party = { ...mockedParties[0], geographicTaxonomies: [] };
    const { store } = renderOverview(party, [
      { productId: 'prod-pagopa', actions: [Actions.UpdateGeoTaxonomy] },
    ]);

    expect(await screen.findByText('Indica l’area geografica')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: 'Nazionale' }));
    fireEvent.click(screen.getByRole('button', { name: 'Aggiungi' }));

    await waitFor(() =>
      expect(DashboardApi.updateInstitutionGeographicTaxonomy).toHaveBeenCalledWith(party.partyId, [
        { code: 'ITA', desc: 'ITALIA' },
      ])
    );
    await waitFor(() =>
      expect(store.getState().parties.selected?.geographicTaxonomies).toEqual([
        { code: 'ITA', desc: 'ITALIA' },
      ])
    );
  });

  test('keeps the party unchanged when saving the geographic taxonomies fails', async () => {
    (DashboardApi.updateInstitutionGeographicTaxonomy as Mock).mockRejectedValueOnce(
      new Error('error')
    );
    const party = { ...mockedParties[0], geographicTaxonomies: [] };
    const { store } = renderOverview(party, [
      { productId: 'prod-pagopa', actions: [Actions.UpdateGeoTaxonomy] },
    ]);

    fireEvent.click(await screen.findByRole('radio', { name: 'Nazionale' }));
    fireEvent.click(screen.getByRole('button', { name: 'Aggiungi' }));

    await waitFor(() =>
      expect(screen.queryByText('Indica l’area geografica')).not.toBeInTheDocument()
    );
    expect(store.getState().parties.selected?.geographicTaxonomies).toEqual([]);
  });

  test('opens and closes the edit geographic taxonomies modal from the party detail', async () => {
    const party = {
      ...mockedParties[0],
      geographicTaxonomies: [{ code: 'ITA', desc: 'ITALIA' }],
    };
    renderOverview(party, [{ productId: 'prod-pagopa', actions: [Actions.UpdateGeoTaxonomy] }]);

    fireEvent.click(screen.getByRole('button', { name: 'Gestisci i dati dell’ente' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Modifica area geografica' }));
    expect(await screen.findByText('Modifica l’area geografica')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Esci' }));
    await waitFor(() =>
      expect(screen.queryByText('Modifica l’area geografica')).not.toBeInTheDocument()
    );
  });

  test('loads the allowed institution types from the CDN when not in mock mode', async () => {
    vi.stubEnv('VITE_API_MOCK_PARTIES', 'false');
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve(mockedCategories) });
    vi.stubGlobal('fetch', fetchMock);

    renderOverview(
      mockedParties[0],
      [{ productId: 'prod-pagopa', actions: [Actions.ListAvailableProducts] }],
      ['PA']
    );

    expect(await screen.findByText('Prodotti disponibili')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://dev.selfcare.pagopa.it/assets/product_institution_types.json'
    );
  });

  test.each([
    ['a failed response', () => Promise.resolve({ ok: false, status: 500, statusText: 'KO' })],
    ['a network error', () => Promise.reject(new Error('network'))],
  ])('does not show available products after %s', async (_label, response) => {
    vi.stubEnv('VITE_API_MOCK_PARTIES', 'false');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.stubGlobal('fetch', vi.fn(response));

    renderOverview(mockedParties[0], [
      { productId: 'prod-pagopa', actions: [Actions.ListAvailableProducts] },
    ]);

    await waitFor(() => expect(consoleError).toHaveBeenCalled());
    expect(screen.queryByText('Prodotti disponibili')).not.toBeInTheDocument();
    consoleError.mockRestore();
  });

  describe('DORA addendum attachment status', () => {
    const pspParty = mockedParties.find((p) => p.description === 'Prova PSP') as Party;
    const doraPermission = { productId: 'prod-pagopa', actions: [Actions.ViewContract] };

    beforeEach(() => {
      vi.stubEnv('VITE_API_MOCK_PARTIES', 'false');
      vi.stubGlobal(
        'fetch',
        vi.fn(() => Promise.resolve({ ok: true, json: () => [] }))
      );
    });

    test('hides the DORA banner when the addendum is already signed', async () => {
      renderOverview(pspParty, [doraPermission], ['PSP']);

      await waitFor(() =>
        expect(DashboardApi.getAttachmentStatus).toHaveBeenCalledWith(
          pspParty.partyId,
          'prod-pagopa',
          'Addendum'
        )
      );
      await waitFor(() =>
        expect(screen.queryByText('Nuovo addendum DORA')).not.toBeInTheDocument()
      );
    });

    test('keeps the DORA banner when the attachment status request fails', async () => {
      (DashboardApi.getAttachmentStatus as Mock).mockRejectedValueOnce(new Error('KO'));
      renderOverview(pspParty, [doraPermission], ['PSP']);

      await waitFor(() => expect(DashboardApi.getAttachmentStatus).toHaveBeenCalled());
      expect(await screen.findByText('Nuovo addendum DORA')).toBeInTheDocument();
    });
  });
});

test('UploadIcon renders with default and custom props', () => {
  const { container, rerender } = render(<UploadIcon />);
  const svg = container.querySelector('svg')!;
  expect(svg).toHaveAttribute('width', '24');
  expect(container.querySelector('path')).toHaveAttribute('fill', 'currentColor');

  rerender(<UploadIcon size={20} color="red" className="icon" />);
  expect(svg).toHaveAttribute('width', '20');
  expect(svg).toHaveClass('icon');
  expect(container.querySelector('path')).toHaveAttribute('fill', 'red');
});
