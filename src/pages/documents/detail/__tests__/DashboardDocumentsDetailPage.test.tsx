import { fireEvent, screen, waitFor } from '@testing-library/react';
import { Mock } from 'vitest';
import { TypeEnum as DocumentTypeEnum } from '../../../../api/generated/b4f-dashboard/DocumentResource';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { getDocument, getDocumentsList } from '../../../../services/documentService';
import { renderWithProviders } from '../../../../utils/test-utils';
import DashboardDocumentsDetailPage from '../DashboardDocumentsDetailPage';

vi.mock('../../../../services/documentService', () => ({
  getDocumentsList: vi.fn(),
  getDocument: vi.fn(),
}));

const contract = { name: 'Contratto_di_adesione_IO.pdf', type: DocumentTypeEnum.INSTITUTION };
const premiumContract = {
  name: 'Contratto_di_adesione_IO_Premium.pdf',
  type: DocumentTypeEnum.INSTITUTION,
};

const renderPage = (search: string) => {
  window.history.pushState({}, '', `/dashboard/1/documents/details${search}`);
  return renderWithProviders(
    <DashboardDocumentsDetailPage party={mockedParties[0]} products={mockedPartyProducts} />
  );
};

describe('DashboardDocumentsDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    expect(screen.getByText('IO Premium')).toBeInTheDocument();
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
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    renderPage('?productId=prod-io&productTitle=IO');

    fireEvent.click(await screen.findByText('Contratto_di_adesione_IO'));

    await waitFor(() => expect(click).toHaveBeenCalled());
    expect(getDocument).toHaveBeenCalledWith(
      mockedParties[0].partyId,
      'prod-io',
      DocumentTypeEnum.INSTITUTION,
      undefined
    );
    expect(screen.getAllByRole('button', { name: /^Scarica/ })).toHaveLength(1);

    vi.unstubAllGlobals();
  });

  test('downloads the document by type and name adding the pdf extension if missing', async () => {
    const document = {
      name: 'Pagamenti_pagoPA_accordo_adesione',
      type: DocumentTypeEnum.INSTITUTION,
    };
    (getDocumentsList as Mock).mockResolvedValue([document]);
    (getDocument as Mock).mockResolvedValue(new Blob(['pdf']));
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { ...URL, createObjectURL: vi.fn(() => 'blob:mock'), revokeObjectURL });
    const savedFileNames: Array<string | null> = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      savedFileNames.push(this.getAttribute('download'));
    });

    renderPage('?productId=prod-io&productTitle=IO');

    fireEvent.click(await screen.findByLabelText(`Scarica ${document.name}`));

    await waitFor(() => expect(savedFileNames).toEqual([`${document.name}.pdf`]));
    expect(getDocument).toHaveBeenCalledWith(
      mockedParties[0].partyId,
      'prod-io',
      DocumentTypeEnum.INSTITUTION,
      document.name
    );
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');

    vi.unstubAllGlobals();
  });
});
