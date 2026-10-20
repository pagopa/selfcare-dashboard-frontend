import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { fireEvent, screen } from '@testing-library/react';
import { Mock } from 'vitest';
import { partiesActions } from '../../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../../redux/store';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { LINK_UPLOAD_GUIDELINES_SEND } from '../../../../../utils/constants';
import { renderWithProviders } from '../../../../../utils/test-utils';
import { PartyDetailModal } from '../PartyDetailModal';

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@pagopa/selfcare-common-frontend/lib/utils/storage')>()),
  isPagoPaUser: vi.fn(() => false),
}));

vi.mock('../components/partyLogoUploader/PartyLogoUploader', () => ({
  PartyLogoUploader: ({ canUploadLogo, partyId, setclearCache }: any) => (
    <button
      data-testid="logo-uploader"
      data-can-upload={canUploadLogo}
      data-party-id={partyId}
      onClick={() => setclearCache(true)}
    >
      upload
    </button>
  ),
}));

const party = mockedParties[0];

const renderModal = ({
  institutionTypes = ['PA'],
  canUploadLogoOnSendProduct = false,
}: {
  institutionTypes?: Array<string>;
  canUploadLogoOnSendProduct?: boolean;
} = {}) => {
  const setOpen = vi.fn();
  const store = createStore();
  store.dispatch(partiesActions.setPartySelectedInstitutionTypes(institutionTypes));
  renderWithProviders(
    <PartyDetailModal
      party={party}
      open={true}
      setOpen={setOpen}
      canUploadLogo={true}
      canUploadLogoOnSendProduct={canUploadLogoOnSendProduct}
      showGeoTaxonomyForInstitutionType={false}
      setOpenModalAddNewGeographicTaxonomies={vi.fn()}
    />,
    store
  );
  return { setOpen };
};

describe('PartyDetailModal', () => {
  beforeEach(() => {
    (isPagoPaUser as Mock).mockReturnValue(false);
  });

  test('renders institution details with info banner for PA users and send logo guide', () => {
    renderModal({ canUploadLogoOnSendProduct: true });

    expect(screen.getByRole('heading', { name: 'Gestisci i dati dell’ente' })).toBeInTheDocument();
    expect(screen.getByTestId('logo-uploader')).toHaveAttribute('data-party-id', party.partyId);
    expect(screen.getByTestId('logo-uploader')).toHaveAttribute('data-can-upload', 'true');
    expect(screen.getByText('consulta le linee guida')).toHaveAttribute(
      'href',
      LINK_UPLOAD_GUIDELINES_SEND
    );
    expect(screen.getByText('Vai al sito')).toBeInTheDocument();
    expect(screen.getByText(party.description)).toBeInTheDocument();
  });

  test('hides info banner and send guide for PagoPA users and non PA institutions', () => {
    (isPagoPaUser as Mock).mockReturnValue(true);
    renderModal({ institutionTypes: ['PA'] });

    expect(screen.getByRole('heading', { name: 'Vedi i dati dell’ente' })).toBeInTheDocument();
    expect(screen.queryByText('consulta le linee guida')).not.toBeInTheDocument();
    expect(screen.queryByText('Vai al sito')).not.toBeInTheDocument();
  });

  test('hides info banner for non PA institutions', () => {
    renderModal({ institutionTypes: ['GSP'] });
    expect(screen.queryByText('Vai al sito')).not.toBeInTheDocument();
  });

  test('closes the modal with the close icon', () => {
    const { setOpen } = renderModal();

    fireEvent.click(screen.getByTestId('close-modal-test'));
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  test('closes the modal and reloads the page after a logo upload', () => {
    const { setOpen } = renderModal();

    fireEvent.click(screen.getByTestId('logo-uploader'));
    fireEvent.click(screen.getByTestId('close-modal-test'));
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  test('closes the drawer with escape, reloading after a logo upload', () => {
    const { setOpen } = renderModal();

    fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape' });
    expect(setOpen).toHaveBeenCalledWith(false);

    setOpen.mockClear();
    fireEvent.click(screen.getByTestId('logo-uploader'));
    fireEvent.keyDown(screen.getByRole('presentation'), { key: 'Escape' });
    expect(setOpen).toHaveBeenCalledWith(false);
  });
});
