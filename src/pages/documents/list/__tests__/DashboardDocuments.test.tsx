import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../utils/test-utils';
import { fetchProductsContractUpdateStatus } from '../../../../services/contractUpdateService';
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
