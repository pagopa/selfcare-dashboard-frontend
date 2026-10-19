import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TypeEnum } from '../../../../api/generated/b4f-dashboard/DelegationResource';
import { DelegationWithInfo } from '../../../../api/generated/b4f-dashboard/DelegationWithInfo';
import { partiesActions } from '../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../redux/store';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../utils/test-utils';
import TechPartnersTable from '../TechPartnersTable';

const baseDelegations: Array<DelegationWithInfo> = [
  {
    brokerId: '111',
    brokerName: 'Broker 1',
    id: '1',
    institutionId: '1111',
    institutionName: 'Institution 1',
    institutionRootName: 'Root Institution',
    productId: 'prod-io',
    taxCode: 'abcdefghijk',
    type: TypeEnum.AOO,
    createdAt: new Date(2024, 0, 10),
  },
  {
    brokerId: '222',
    brokerName: 'Broker EA',
    id: '2',
    institutionId: 'institutionId0',
    institutionName: 'Institution EA',
    institutionRootName: 'Root Institution',
    productId: 'prod-pagopa',
    taxCode: '12345678901',
    type: TypeEnum.EA,
    createdAt: new Date(2024, 0, 5),
  },
];

const manyDelegations: Array<DelegationWithInfo> = Array.from({ length: 12 }, (_, i) => ({
  brokerId: `broker${i}`,
  id: `id${i}`,
  institutionId: `inst${i}`,
  institutionName: `Ente ${String.fromCharCode(65 + i)}`,
  productId: 'prod-io',
  taxCode: `TAX${String(i).padStart(8, '0')}`,
  type: TypeEnum.PT,
  createdAt: new Date(2024, 0, i + 1),
}));

const renderTable = (
  delegations: Array<DelegationWithInfo> = baseDelegations,
  setupStore?: (store: ReturnType<typeof createStore>) => void
) => {
  const store = createStore();
  setupStore?.(store);
  return renderWithProviders(
    <TechPartnersTable delegationsWithoutDuplicates={delegations} />,
    store
  );
};

const getFirstColumnTexts = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

const chooseSearchBy = async (user: ReturnType<typeof userEvent.setup>, label: string) => {
  await user.click(screen.getByLabelText('Cerca per'));
  await user.click(await screen.findByRole('option', { name: label }));
};

describe('TechPartnersTable', () => {
  test('renders rows with institution, tax code, product title and date', () => {
    renderTable(baseDelegations, (store) =>
      store.dispatch(partiesActions.setPartySelectedProducts(mockedPartyProducts))
    );

    expect(screen.getByText('Institution 1 - Root Institution')).toBeInTheDocument();
    expect(screen.getByText('ABCDEFGHIJK')).toBeInTheDocument();
    expect(screen.getByText('IO')).toBeInTheDocument();
    expect(screen.getByText('Pagamenti pagoPA')).toBeInTheDocument();
    expect(screen.getByText(new Date(2024, 0, 10).toLocaleDateString())).toBeInTheDocument();
    // Filter inputs are disabled until a search criteria is chosen
    expect(screen.getByLabelText('Inserisci')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Filtra' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Rimuovi filtri' })).toBeDisabled();
    // Pagination and page size selector hidden with few items
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  test('renders fallbacks for missing data', () => {
    renderTable([{ id: 'x', type: TypeEnum.PT }]);

    const row = screen.getAllByRole('row')[1];
    const cells = within(row).getAllByRole('cell');
    expect(cells[0]).toHaveTextContent('');
    expect(cells[1]).toHaveTextContent('-');
    expect(cells[2]).toHaveTextContent('');
    expect(cells[3]).toHaveTextContent('-');
  });

  test('EA delegation is clickable only if the institution is in the parties list', async () => {
    const assignSpy = vi.fn();
    vi.stubGlobal('location', { ...window.location, assign: assignSpy });

    renderTable(baseDelegations, (store) =>
      store.dispatch(
        partiesActions.setPartiesList([
          {
            partyId: 'institutionId0',
            description: 'Institution EA',
            status: 'ACTIVE',
            userRole: 'ADMIN',
          },
        ])
      )
    );

    expect(
      screen.queryByRole('button', { name: 'Institution 1 - Root Institution' })
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Institution EA - Root Institution' }));
    expect(assignSpy).toHaveBeenCalledWith('/dashboard/institutionId0');

    vi.unstubAllGlobals();
  });

  test('EA delegation is not clickable when the parties list is empty', () => {
    renderTable();
    expect(
      screen.queryByRole('button', { name: 'Institution EA - Root Institution' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Institution EA - Root Institution')).toBeInTheDocument();
  });

  test('sorts by institution name and by creation date', () => {
    renderTable();

    expect(getFirstColumnTexts()).toEqual([
      'Institution 1 - Root Institution',
      'Institution EA - Root Institution',
    ]);

    fireEvent.click(screen.getByText('Ente'));
    expect(getFirstColumnTexts()).toEqual([
      'Institution EA - Root Institution',
      'Institution 1 - Root Institution',
    ]);
    expect(screen.getByText('sorted descending')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Delegato il'));
    expect(getFirstColumnTexts()).toEqual([
      'Institution EA - Root Institution',
      'Institution 1 - Root Institution',
    ]);
    expect(screen.getByText('sorted ascending')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Delegato il'));
    expect(getFirstColumnTexts()).toEqual([
      'Institution 1 - Root Institution',
      'Institution EA - Root Institution',
    ]);
  });

  test('filters by name, shows empty results and resets filters', async () => {
    const user = userEvent.setup({ delay: null });
    renderTable();

    await chooseSearchBy(user, 'Nome');
    const input = screen.getByLabelText('Nome');
    expect(input).toBeEnabled();
    const filterButton = screen.getByRole('button', { name: 'Filtra' });

    await user.type(input, 'in');
    expect(filterButton).toBeDisabled();
    await user.type(input, 'stitution ea');
    expect(filterButton).toBeEnabled();
    await user.click(filterButton);

    expect(getFirstColumnTexts()).toEqual(['Institution EA - Root Institution']);

    await user.clear(input);
    await user.type(input, 'does not exist');
    await user.click(filterButton);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(
      screen.getByText(/I filtri che hai applicato non hanno dato nessun risultato/)
    ).toBeInTheDocument();

    const resetButtons = screen.getAllByRole('button', { name: 'Rimuovi filtri' });
    await user.click(resetButtons[resetButtons.length - 1]);

    expect(getFirstColumnTexts()).toHaveLength(2);
    expect(screen.getByLabelText('Inserisci')).toBeDisabled();
    expect(screen.getByLabelText('Inserisci')).toHaveValue('');
  });

  test('filters by fiscal code only when the code is 11 characters long', async () => {
    const user = userEvent.setup({ delay: null });
    renderTable();

    await chooseSearchBy(user, 'Nome');
    await user.type(screen.getByLabelText('Nome'), 'abc');
    // changing the search criteria clears the search term
    await chooseSearchBy(user, 'Codice fiscale');
    const input = screen.getByLabelText('Codice fiscale');
    expect(input).toHaveValue('');
    expect(input).toHaveAttribute('maxLength', '11');

    const filterButton = screen.getByRole('button', { name: 'Filtra' });
    await user.type(input, 'ABCDEFGHIJ');
    expect(filterButton).toBeDisabled();
    await user.type(input, 'K');
    expect(filterButton).toBeEnabled();
    await user.click(filterButton);

    expect(getFirstColumnTexts()).toEqual(['Institution 1 - Root Institution']);

    await user.click(screen.getByRole('button', { name: 'Rimuovi filtri' }));
    expect(getFirstColumnTexts()).toHaveLength(2);
  });

  test('paginates and changes the number of items per page', async () => {
    const user = userEvent.setup({ delay: null });
    renderTable(manyDelegations);

    expect(getFirstColumnTexts()).toHaveLength(10);
    expect(getFirstColumnTexts()[0]).toBe('Ente A');

    const pagination = screen.getByRole('navigation');
    expect(within(pagination).queryByLabelText('Go to previous page')).not.toBeInTheDocument();
    await user.click(within(pagination).getByRole('button', { name: 'Go to page 2' }));

    expect(getFirstColumnTexts()).toEqual(['Ente K', 'Ente L']);
    expect(within(pagination).queryByLabelText('Go to next page')).not.toBeInTheDocument();

    const pageSizeSelect = screen.getByRole('combobox', { name: '' });
    expect(pageSizeSelect).toHaveTextContent('10');
    await user.click(pageSizeSelect);
    await user.click(await screen.findByRole('option', { name: '20' }));

    await waitFor(() => expect(screen.queryByRole('navigation')).not.toBeInTheDocument());
  });
});
