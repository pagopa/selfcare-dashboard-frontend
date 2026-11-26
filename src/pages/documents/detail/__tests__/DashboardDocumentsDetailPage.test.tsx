import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { Mock } from 'vitest';
import { TypeEnum as DocumentTypeEnum } from '../../../../api/generated/b4f-dashboard/DocumentResource';
import { ProductOnBoardingStatusEnum } from '../../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { useIsPagoPaUser } from '../../../../hooks/useIsPagoPaUser';
import { createStore } from '../../../../redux/store';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { getDocument, getDocumentsList } from '../../../../services/documentService';
import { renderWithProviders } from '../../../../utils/test-utils';
import DashboardDocumentsDetailPage from '../DashboardDocumentsDetailPage';

vi.mock('../../../../services/documentService', () => ({
  getDocumentsList: vi.fn(),
  getDocument: vi.fn(),
}));
vi.mock('../../../../hooks/useIsPagoPaUser', () => ({
  useIsPagoPaUser: vi.fn(() => false),
}));

const contract = { name: 'Contratto_di_adesione_IO.pdf', type: DocumentTypeEnum.INSTITUTION };
const premiumContract = {
  name: 'Contratto_di_adesione_IO_Premium.pdf',
  type: DocumentTypeEnum.INSTITUTION,
};

const party = {
  ...mockedParties[0],
  products: ['prod-io', 'prod-io-premium', 'prod-pagopa', 'prod-dashboard-psp'].map(
    (productId) => ({
      productId,
      productOnBoardingStatus: ProductOnBoardingStatusEnum.ACTIVE,
    })
  ),
};
const products = mockedPartyProducts.map((product) => ({
  ...product,
  subProducts: product.subProducts?.map((subProduct) => ({
    ...subProduct,
    contractEnabled: true,
  })),
}));
const permissions = ['prod-io', 'prod-pagopa'].map((productId) => ({
  productId,
  actions: [Actions.ViewContract],
}));

const renderPage = (
  search: string,
  selectedProducts = products,
  selectedPermissions = permissions
) => {
  window.history.pushState({}, '', `/dashboard/1/documents/details${search}`);
  const store = createStore();
  store.dispatch(setProductPermissions(selectedPermissions));
  return renderWithProviders(
    <DashboardDocumentsDetailPage party={party} products={selectedProducts} />,
    store
  );
};

describe('DashboardDocumentsDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useIsPagoPaUser).mockReturnValue(false);
  });

  test('requests only eligible product documents for SelfCare', async () => {
    (getDocumentsList as Mock).mockResolvedValue([contract]);
    const catalog = products.map((product) =>
      product.id === 'prod-io'
        ? {
            ...product,
            subProducts: product.subProducts?.map((subProduct) => ({
              ...subProduct,
              contractEnabled: false,
            })),
          }
        : product
    );

    renderPage('?productId=prod-io&subProductId=prod-io-premium', catalog);
    expect(await screen.findByText(contract.name)).toBeInTheDocument();
    expect(getDocumentsList).toHaveBeenCalledTimes(1);
    expect(getDocumentsList).toHaveBeenCalledWith(party.partyId, 'prod-io');
  });

  test('does not request documents without ViewContract', () => {
    renderPage('?productId=prod-io&productTitle=IO', products, []);
    expect(getDocumentsList).not.toHaveBeenCalled();
  });

  test('hides previously loaded documents when permission is removed', async () => {
    (getDocumentsList as Mock).mockResolvedValue([contract]);
    const { store } = renderPage('?productId=prod-io&productTitle=IO');
    expect(await screen.findByText(contract.name)).toBeInTheDocument();

    act(() => store.dispatch(setProductPermissions([])));
    expect(screen.queryByText(contract.name)).not.toBeInTheDocument();
  });

  test('ignores a document response after permission is removed', async () => {
    // eslint-disable-next-line functional/no-let
    let resolveDocuments!: (documents: Array<typeof contract>) => void;
    (getDocumentsList as Mock).mockReturnValue(
      new Promise((resolve) => {
        resolveDocuments = resolve;
      })
    );
    const { store } = renderPage('?productId=prod-io&productTitle=IO');
    act(() => store.dispatch(setProductPermissions([])));
    await act(async () => resolveDocuments([contract]));
    expect(screen.queryByText(contract.name)).not.toBeInTheDocument();
  });

  test('keeps existing PagoPA operator requests without contract eligibility', async () => {
    vi.mocked(useIsPagoPaUser).mockReturnValue(true);
    (getDocumentsList as Mock).mockResolvedValue([contract]);
    renderPage('?productId=other&productTitle=Other', products, []);
    expect(await screen.findByText(contract.name)).toBeInTheDocument();
    expect(getDocumentsList).toHaveBeenCalledWith(party.partyId, 'other');
  });

  test('shows the documents of the product without the product heading', async () => {
    (getDocumentsList as Mock).mockResolvedValue([contract]);

    renderPage('?productId=prod-io&productTitle=IO');

    expect(await screen.findByText(contract.name)).toBeInTheDocument();
    expect(getDocumentsList).toHaveBeenCalledTimes(1);
    expect(getDocumentsList).toHaveBeenCalledWith(mockedParties[0].partyId, 'prod-io');
    expect(screen.getByText('Attiva')).toBeInTheDocument();
    expect(
      screen.queryByText(
        'Non ci è possibile recuperare questo documento, ma la tua adesione al prodotto resta valida.'
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByText('IO Premium')).not.toBeInTheDocument();
  });

  test('groups the documents of product and sub product', async () => {
    (getDocumentsList as Mock).mockImplementation((_partyId: string, productId: string) =>
      Promise.resolve(productId === 'prod-io' ? [contract] : [premiumContract])
    );

    renderPage('?productId=prod-io&subProductId=prod-io-premium&productTitle=IO');

    expect(await screen.findByText(premiumContract.name)).toBeInTheDocument();
    expect(screen.getByText(contract.name)).toBeInTheDocument();
    expect(getDocumentsList).toHaveBeenCalledWith(mockedParties[0].partyId, 'prod-io-premium');
    expect(screen.getByRole('heading', { name: 'IO Premium' })).toBeInTheDocument();
  });

  test('uses the PSP sub-product name rather than the parent name on the detail page', async () => {
    (getDocumentsList as Mock).mockResolvedValue([{ type: DocumentTypeEnum.INSTITUTION }]);
    const subProductTitle = 'Servizio di dashboarding pagoPA per PSP';

    renderPage(
      '?productId=prod-pagopa&subProductId=prod-dashboard-psp&productTitle=Pagamenti%20pagoPA'
    );

    expect(await screen.findByText(`Contratto_di_adesione_${subProductTitle}`)).toBeInTheDocument();
    expect(screen.getByText('Contratto_di_adesione_Pagamenti pagoPA')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: subProductTitle })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toHaveTextContent(
      subProductTitle
    );
  });

  test('keeps the documents of the product that loaded when the other request fails', async () => {
    (getDocumentsList as Mock).mockImplementation((_partyId: string, productId: string) =>
      productId === 'prod-io'
        ? Promise.reject(new Error('unavailable'))
        : Promise.resolve([premiumContract])
    );

    const { store } = renderPage('?productId=prod-io&subProductId=prod-io-premium&productTitle=IO');

    expect(await screen.findByText(premiumContract.name)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'IO Premium' })).toBeInTheDocument();
    expect(screen.queryByText(contract.name)).not.toBeInTheDocument();
    await waitFor(() =>
      expect(store.getState().appState.errors).toEqual([
        expect.objectContaining({
          id: expect.stringMatching(`^getDocumentsList-${mockedParties[0].partyId}-prod-io_`),
          toNotify: true,
        }),
      ])
    );
  });

  test('shows the missing contract message when there is no INSTITUTION document', async () => {
    (getDocumentsList as Mock).mockResolvedValue([
      { name: 'Addendum.pdf', type: DocumentTypeEnum.ATTACHMENT },
    ]);

    renderPage('?productId=prod-io&productTitle=IO');

    expect(await screen.findByText('Addendum.pdf')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Non ci è possibile recuperare questo documento, ma la tua adesione al prodotto resta valida.'
      )
    ).toBeInTheDocument();
  });

  test('shows a nameless contract with a fallback label and hides nameless attachments', async () => {
    (getDocumentsList as Mock).mockResolvedValue([
      { type: DocumentTypeEnum.INSTITUTION },
      { type: DocumentTypeEnum.ATTACHMENT },
    ]);
    (getDocument as Mock).mockResolvedValue(new Blob(['pdf']));
    vi.stubGlobal('URL', { ...URL, createObjectURL: vi.fn(), revokeObjectURL: vi.fn() });
    const tab = { location: { href: '' }, opener: {}, close: vi.fn() };
    const open = vi.spyOn(window, 'open').mockReturnValue(tab as unknown as Window);

    renderPage('?productId=prod-io&productTitle=IO');

    fireEvent.click(await screen.findByText('Contratto_di_adesione_IO'));

    expect(open).toHaveBeenCalledWith('', '_blank');
    expect(getDocument).toHaveBeenCalledWith(
      mockedParties[0].partyId,
      'prod-io',
      DocumentTypeEnum.INSTITUTION,
      undefined
    );
    expect(screen.getAllByRole('button', { name: /^Apri/ })).toHaveLength(1);

    vi.unstubAllGlobals();
  });

  test('opens the document as pdf in a new tab', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const document = {
      name: 'Pagamenti_pagoPA_accordo_adesione',
      type: DocumentTypeEnum.INSTITUTION,
    };
    (getDocumentsList as Mock).mockResolvedValue([document]);
    (getDocument as Mock).mockResolvedValue(new Blob(['pdf']));
    const revokeObjectURL = vi.fn();
    const createObjectURL = vi.fn((_blob: Blob) => 'blob:mock');
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL });
    const tab = { location: { href: '' }, opener: {}, close: vi.fn() };
    vi.spyOn(window, 'open').mockReturnValue(tab as unknown as Window);

    renderPage('?productId=prod-io&productTitle=IO');

    fireEvent.click(await screen.findByLabelText(`Apri ${document.name} in una nuova scheda`));

    await waitFor(() => expect(tab.location.href).toBe('blob:mock'));
    expect(tab.opener).toBeNull();
    expect(createObjectURL.mock.calls[0][0].type).toBe('application/pdf');
    expect(getDocument).toHaveBeenCalledWith(
      mockedParties[0].partyId,
      'prod-io',
      DocumentTypeEnum.INSTITUTION,
      document.name
    );
    expect(revokeObjectURL).not.toHaveBeenCalled();
    vi.advanceTimersByTime(60_000);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');

    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  test('closes the new tab when the document cannot be retrieved', async () => {
    (getDocumentsList as Mock).mockResolvedValue([contract]);
    (getDocument as Mock).mockRejectedValue(new Error('unavailable'));
    const tab = { location: { href: '' }, opener: {}, close: vi.fn() };
    vi.spyOn(window, 'open').mockReturnValue(tab as unknown as Window);

    renderPage('?productId=prod-io&productTitle=IO');

    fireEvent.click(await screen.findByLabelText(`Apri ${contract.name} in una nuova scheda`));

    await waitFor(() => expect(tab.close).toHaveBeenCalled());
  });
});
