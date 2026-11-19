import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../utils/test-utils';
import {
  fetchProductsContractUpdateStatus,
  ProductContractUpdateStatus,
} from '../../../../services/contractUpdateService';
import DashboardDocumentsPage from '../DashboardDocumentsPage';
import { getDocumentProductIds, getDocumentProducts } from '../productUtils';

vi.mock('../../../../services/contractUpdateService', () => ({
  fetchProductsContractUpdateStatus: vi.fn(() => Promise.resolve([])),
}));

afterEach(() => vi.restoreAllMocks());

test('should render component DashboardDocuments', async () => {
  const party = mockedParties[2];
  const { store } = renderWithProviders(
    <DashboardDocumentsPage party={party} products={mockedPartyProducts} />
  );

  const mockedActions = party.products
    .filter((product) => product.productOnBoardingStatus === 'ACTIVE')
    .map((product) => ({
      productId: product.productId ?? '',
      actions: product.userProductActions ? [...product.userProductActions] : [],
    }));
  act(() => {
    store.dispatch(setProductPermissions(mockedActions));
  });

  const documenTitle = await screen.findByText('Documenti');

  expect(documenTitle).toBeInTheDocument();

  const seeMoreButtons = await screen.findAllByText('Vedi di più');

  expect(seeMoreButtons[1]).toBeInTheDocument();
  expect(
    screen.getByText('Altri prodotti attivi per il tuo ente (non gestibili dal tuo profilo)')
  ).toBeInTheDocument();
  expect(screen.getByText('Carta Giovani')).toBeInTheDocument();
  await waitFor(() =>
    expect(fetchProductsContractUpdateStatus).toHaveBeenCalledWith(
      party.partyId,
      getDocumentProductIds(getDocumentProducts(party, mockedPartyProducts))
    )
  );
  fireEvent.click(seeMoreButtons[1]);
});

test('does not show the previous party statuses while fetching the new party statuses', async () => {
  const party = mockedParties[2];
  const productId = getDocumentProductIds(getDocumentProducts(party, mockedPartyProducts))[0];
  vi.mocked(fetchProductsContractUpdateStatus)
    .mockResolvedValueOnce([
      { productId, contractUpdateRequired: true, contractUpdateInProgress: false },
    ])
    .mockImplementationOnce(() => new Promise<Array<ProductContractUpdateStatus>>(() => {}));

  const PartySwitcher = () => {
    const [currentParty, setCurrentParty] = useState(party);
    return (
      <>
        <button onClick={() => setCurrentParty({ ...party, partyId: 'party-2' })}>
          Switch party
        </button>
        <DashboardDocumentsPage party={currentParty} products={mockedPartyProducts} />
      </>
    );
  };

  renderWithProviders(<PartySwitcher />);
  expect(screen.getByText('Documenti')).toBeInTheDocument();
  expect(screen.getByRole('progressbar', { name: 'Documenti' })).toBeInTheDocument();
  expect(screen.queryByText('Carta Giovani')).not.toBeInTheDocument();

  expect(await screen.findByText('Documento mancante')).toBeInTheDocument();
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Switch party' }));

  expect(screen.queryByText('Documento mancante')).not.toBeInTheDocument();
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
  expect(screen.queryByText('Carta Giovani')).not.toBeInTheDocument();
  expect(fetchProductsContractUpdateStatus).toHaveBeenLastCalledWith(
    'party-2',
    getDocumentProductIds(
      getDocumentProducts({ ...party, partyId: 'party-2' }, mockedPartyProducts)
    )
  );
});

test('shows product cards if the status request fails', async () => {
  vi.mocked(fetchProductsContractUpdateStatus).mockRejectedValueOnce(new Error('Request failed'));
  renderWithProviders(
    <DashboardDocumentsPage party={mockedParties[2]} products={mockedPartyProducts} />
  );

  expect(await screen.findByText('Carta Giovani')).toBeInTheDocument();
  expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
});
