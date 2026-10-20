import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { TypeEnum } from '../../../api/generated/b4f-dashboard/DelegationResource';
import { createStore } from '../../../redux/store';
import { fetchDelegations } from '../../../services/delegationServices';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardDelegationsPage from '../DashboardDelegationsPage';

vi.mock('../../../services/delegationServices', () => ({
  fetchDelegations: vi.fn(),
}));

const mockedFetchDelegations = vi.mocked(fetchDelegations);

const party = mockedParties[2];
const prodIo = mockedPartyProducts.find((p) => p.id === 'prod-io')!;
const prodPagopa = mockedPartyProducts.find((p) => p.id === 'prod-pagopa')!;
const delegableProducts = [prodIo, prodPagopa];

const delegations = [
  {
    id: 'del-1',
    brokerId: 'b1',
    brokerName: 'Broker Uno',
    institutionId: party.partyId,
    productId: 'prod-io',
    type: TypeEnum.PT,
  },
  {
    id: 'del-2',
    brokerId: 'b2',
    brokerName: 'Broker Due',
    institutionId: party.partyId,
    productId: 'prod-io',
    type: TypeEnum.PT,
  },
];

const renderPage = (permittedProductIds: Array<string> = []) => {
  const store = createStore();
  store.dispatch(
    setProductPermissions(
      permittedProductIds.map((productId) => ({
        productId,
        actions: [Actions.CreateDelegation],
      }))
    )
  );
  return renderWithProviders(
    <DashboardDelegationsPage party={party} delegableProducts={delegableProducts} />,
    store
  );
};

describe('DashboardDelegationsPage', () => {
  test('shows a loader and then delegates grouped by product', async () => {
    mockedFetchDelegations.mockResolvedValue(delegations);
    renderPage(['prod-io']);

    expect(document.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();

    expect(await screen.findByText('Broker Uno')).toBeInTheDocument();
    expect(screen.getByText('Broker Due')).toBeInTheDocument();
    expect(screen.getAllByText('Delegato')).toHaveLength(2);
    expect(mockedFetchDelegations).toHaveBeenCalledWith(party.partyId);
    expect(screen.getByText('Deleghe')).toBeInTheDocument();
    expect(screen.getByText(prodIo.title)).toBeInTheDocument();
    expect(screen.getByText(prodPagopa.title)).toBeInTheDocument();
    // prod-pagopa has no delegations and no create permission
    expect(screen.getByText('Ancora nessuna delega')).toBeInTheDocument();
  });

  test('add delegation button navigates to the add page without productId', async () => {
    mockedFetchDelegations.mockResolvedValue(delegations);
    const { history } = renderPage(['prod-io']);

    const addButton = await screen.findByRole('button', { name: 'Aggiungi delega' });
    fireEvent.click(addButton);

    expect(history.location.pathname).toBe(`/dashboard/${party.partyId}/delegations/add`);
    expect(history.location.search).toBe('');
  });

  test('without create permission no add button and no link are shown', async () => {
    mockedFetchDelegations.mockResolvedValue([]);
    renderPage([]);

    expect(await screen.findAllByText('Ancora nessuna delega')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: 'Aggiungi delega' })).not.toBeInTheDocument();
    expect(screen.queryByText('creane una adesso')).not.toBeInTheDocument();
  });

  test('link on a product without delegations navigates with productId query', async () => {
    mockedFetchDelegations.mockResolvedValue([]);
    const { history } = renderPage(['prod-pagopa']);

    const link = await screen.findByText('creane una adesso');
    // prod-io has no permission so it shows the plain label
    expect(screen.getByText('Ancora nessuna delega')).toBeInTheDocument();
    fireEvent.click(link);

    expect(history.location.pathname).toBe(`/dashboard/${party.partyId}/delegations/add`);
    expect(history.location.search).toBe('?productId=prod-pagopa');
  });

  test('opens the documentation when clicking on "what is a delegation"', async () => {
    mockedFetchDelegations.mockResolvedValue([]);
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderPage();

    fireEvent.click(await screen.findByText('Cos’è una delega?'));

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('docs.pagopa.it/manuale-di-area-riservata-per-partner-tecnologici')
    );
    openSpy.mockRestore();
  });

  test('dispatches a blocking error when fetching delegations fails', async () => {
    mockedFetchDelegations.mockRejectedValue(new Error('boom'));
    const { store } = renderPage(['prod-io']);

    await waitFor(() => expect(store.getState().appState.errors).toHaveLength(1));
    const error = store.getState().appState.errors[0];
    expect(error.id).toMatch(`FETCH_PARTY_DELEGATIONS_ERROR-${party.partyId}`);
    expect(error.blocking).toBe(true);
    expect(error.displayableTitle).toBe('Spiacenti, qualcosa è andato storto.');
    expect(await screen.findByText('Prodotti')).toBeInTheDocument();
  });
});
