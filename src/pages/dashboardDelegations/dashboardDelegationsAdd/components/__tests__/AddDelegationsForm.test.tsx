import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrokerResource } from '../../../../../api/generated/b4f-dashboard/BrokerResource';
import { TypeEnum } from '../../../../../api/generated/b4f-dashboard/DelegationResource';
import { fetchDelegations } from '../../../../../services/delegationServices';
import { createDelegation, getProductBrokers } from '../../../../../services/partyService';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import AddDelegationForm from '../AddDelegationForm';

vi.mock('../../../../../services/delegationServices', () => ({
  fetchDelegations: vi.fn(),
}));

vi.mock('../../../../../services/partyService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../../../../services/partyService')>()),
  createDelegation: vi.fn(),
  getProductBrokers: vi.fn(),
}));

const mockedFetchDelegations = vi.mocked(fetchDelegations);
const mockedGetProductBrokers = vi.mocked(getProductBrokers);
const mockedCreateDelegation = vi.mocked(createDelegation);

const party = mockedParties[2];
const prodIo = mockedPartyProducts.find((p) => p.id === 'prod-io')!;
const prodPagopa = mockedPartyProducts.find((p) => p.id === 'prod-pagopa')!;

const brokers: Array<BrokerResource> = [
  { code: '33333333333', description: 'Zeta Partner', enabled: true },
  { code: '11111111111', description: "'Alfa Partner", enabled: true },
  { code: '22222222222', description: 'Beta Partner', enabled: true },
  { code: '44444444444', description: 'Already Delegated', enabled: true },
  { code: '55555555555', enabled: true },
];

const existingDelegations = [
  {
    id: 'd1',
    brokerId: '44444444444',
    brokerName: 'Already Delegated',
    institutionId: party.partyId,
    productId: 'prod-io',
    type: TypeEnum.PT,
  },
];

beforeEach(() => {
  mockedFetchDelegations.mockResolvedValue(existingDelegations);
  mockedGetProductBrokers.mockResolvedValue(brokers);
  mockedCreateDelegation.mockResolvedValue({ id: 'newDelegation' });
});

const renderForm = (props?: Partial<Parameters<typeof AddDelegationForm>[0]>) =>
  renderWithProviders(
    <AddDelegationForm productsWithCreateDelegationAction={[prodIo]} party={party} {...props} />
  );

const getOptionLabels = () =>
  within(screen.getByRole('listbox'))
    .getAllByRole('option')
    .map((o) => o.textContent);

const selectPartner = async (user: ReturnType<typeof userEvent.setup>, text: string) => {
  const input = screen.getByLabelText('Inserisci la ragione sociale');
  await user.type(input, text);
  await user.click(await screen.findByRole('option', { name: new RegExp(text) }));
};

describe('AddDelegationForm', () => {
  test('renders with no products and navigates back to delegations on exit', () => {
    const { history } = renderWithProviders(
      <AddDelegationForm productsWithCreateDelegationAction={[]} party={party} />
    );

    expect(screen.getByText('Aggiungi una delega')).toBeInTheDocument();
    expect(screen.getByText('Dubbi? Vai al manuale')).toHaveAttribute(
      'href',
      'https://docs.pagopa.it/area-riservata/area-riservata/come-funziona/come-delegare-la-gestione'
    );
    expect(screen.getByRole('button', { name: 'Conferma' })).toBeDisabled();
    expect(mockedGetProductBrokers).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Esci'));
    expect(history.location.pathname).toBe(`/dashboard/${party.partyId}/delegations`);
  });

  test('auto-selects the only product and shows sorted, not yet delegated brokers', async () => {
    const user = userEvent.setup({ delay: null });
    renderForm();

    expect(screen.getByText(prodIo.title)).toBeInTheDocument();
    await waitFor(() => expect(mockedGetProductBrokers).toHaveBeenCalledWith('prod-io', 'PA'));
    expect(mockedFetchDelegations).toHaveBeenCalledWith(party.partyId);

    const input = screen.getByLabelText('Inserisci la ragione sociale');
    await user.type(input, 'partner');

    await waitFor(() =>
      expect(getOptionLabels()).toEqual(["'Alfa Partner", 'Beta Partner', 'Zeta Partner'])
    );
  });

  test('shows the not found label when no broker matches the name', async () => {
    const user = userEvent.setup({ delay: null });
    renderForm();
    await waitFor(() => expect(mockedGetProductBrokers).toHaveBeenCalled());

    await user.type(screen.getByLabelText('Inserisci la ragione sociale'), 'nothing matches');

    expect(await screen.findByText('Nessun risultato')).toBeInTheDocument();
  });

  test('allows choosing a product from the select when many are available', async () => {
    renderForm({ productsWithCreateDelegationAction: [prodIo, prodPagopa] });

    expect(mockedGetProductBrokers).not.toHaveBeenCalled();
    expect(screen.queryByText(prodPagopa.title)).not.toBeInTheDocument();

    fireEvent.mouseDown(document.getElementById('select-product-choose') as HTMLElement);
    fireEvent.click(await screen.findByRole('option', { name: prodPagopa.title }));

    await waitFor(() => expect(mockedGetProductBrokers).toHaveBeenCalledWith('prod-pagopa', 'PSP'));
    expect(screen.getByText(prodPagopa.title)).toBeInTheDocument();
  });

  test('uses the product selected by query', async () => {
    renderForm({
      productsWithCreateDelegationAction: [prodIo, prodPagopa],
      selectedProductByQuery: prodPagopa,
    });

    await waitFor(() => expect(mockedGetProductBrokers).toHaveBeenCalledWith('prod-pagopa', 'PSP'));
    expect(screen.getByText(prodPagopa.title)).toBeInTheDocument();
  });

  test('search by fiscal code filters only with a complete code and shows the custom list header', async () => {
    const user = userEvent.setup({ delay: null });
    renderForm();
    await waitFor(() => expect(mockedGetProductBrokers).toHaveBeenCalled());

    const radio = screen.getByLabelText('Codice Fiscale ente');
    await user.click(radio);
    expect(radio).toBeChecked();

    const input = screen.getByLabelText('Inserisci il Codice Fiscale');
    await user.type(input, '2222');
    expect(screen.queryByRole('option')).not.toBeInTheDocument();

    await user.type(input, '2222222');
    const option = await screen.findByRole('option');
    expect(option).toHaveTextContent('22222222222');
    expect(option).toHaveTextContent('Beta Partner');
    // CustomListBoxComponent header
    expect(screen.getByText('Codice Fiscale')).toBeInTheDocument();
    expect(within(screen.getByRole('listbox')).getByText('Ragione sociale')).toBeInTheDocument();

    await user.click(option);
    expect(screen.getByRole('button', { name: 'Conferma' })).toBeEnabled();
  });

  test('confirming the delegation creates it, notifies and redirects', async () => {
    const user = userEvent.setup({ delay: null });
    const { store, history } = renderForm();
    await waitFor(() => expect(mockedGetProductBrokers).toHaveBeenCalled());

    await selectPartner(user, 'Beta');
    const confirm = screen.getByRole('button', { name: 'Conferma' });
    expect(confirm).toBeEnabled();
    await user.click(confirm);

    const modal = store.getState().appState.userNotifies[0];
    expect(modal.component).toBe('SessionModal');
    expect(modal.title).toBe('Confermi la delega?');

    modal.onConfirm!();

    await waitFor(() =>
      expect(history.location.pathname).toBe(`/dashboard/${party.partyId}/delegations`)
    );
    expect(mockedCreateDelegation).toHaveBeenCalledWith(
      party,
      prodIo,
      expect.objectContaining({ code: '22222222222', description: 'Beta Partner' })
    );
    const toast = store
      .getState()
      .appState.userNotifies.find((n) => n.id.startsWith('DELEGATION_CREATED_SUCCESSFULLY'));
    expect(toast?.title).toBe('Delega aggiunta correttamente.');
  });

  test.each([
    [409, 'Il Partner selezionato risulta già associato all’ente.'],
    [500, 'Non è stato possibile aggiungere la delega. Riprova.'],
  ])('shows an error toast when creation fails with status %s', async (httpStatus, title) => {
    mockedCreateDelegation.mockRejectedValue({ httpStatus });
    const user = userEvent.setup({ delay: null });
    const { store, history } = renderForm();
    await waitFor(() => expect(mockedGetProductBrokers).toHaveBeenCalled());

    await selectPartner(user, 'Zeta');
    await user.click(screen.getByRole('button', { name: 'Conferma' }));
    store.getState().appState.userNotifies[0].onConfirm!();

    await waitFor(() => expect(store.getState().appState.errors).toHaveLength(1));
    const error = store.getState().appState.errors[0];
    expect(error.id).toMatch('DELEGATION_NOT_CREATED');
    expect(error.displayableTitle).toBe(title);
    expect(history.location.pathname).not.toMatch('/delegations');
  });

  test('dispatches an error when fetching delegations fails', async () => {
    mockedFetchDelegations.mockRejectedValue(new Error('fetch error'));
    const { store } = renderForm();

    await waitFor(() =>
      expect(
        store
          .getState()
          .appState.errors.some((e) =>
            e.id.startsWith(`FETCH_PARTY_DELEGATIONS_ERROR-${party.partyId}`)
          )
      ).toBe(true)
    );
  });

  test('dispatches an error when fetching product brokers fails', async () => {
    mockedGetProductBrokers.mockRejectedValue(new Error('brokers error'));
    const { store } = renderForm();

    await waitFor(() =>
      expect(
        store.getState().appState.errors.some((e) => e.id.startsWith('PRODUCT_BROKERS_NOT_FOUND'))
      ).toBe(true)
    );
  });
});
