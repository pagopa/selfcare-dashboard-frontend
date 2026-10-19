import { screen, waitFor } from '@testing-library/react';
import { TypeEnum } from '../../../../api/generated/b4f-dashboard/DelegationResource';
import { DelegationWithInfo } from '../../../../api/generated/b4f-dashboard/DelegationWithInfo';
import { Party } from '../../../../model/Party';
import { partiesActions } from '../../../../redux/slices/partiesSlice';
import { createStore } from '../../../../redux/store';
import { getDelegatingInstitutions } from '../../../../services/technologyPartnerService';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../utils/test-utils';
import TechnologyPartnerTable from '../TechnologyPartnerTable';

vi.mock('../../../../services/technologyPartnerService', () => ({
  getDelegatingInstitutions: vi.fn(),
}));

const mockedGetDelegatingInstitutions = vi.mocked(getDelegatingInstitutions);

const ptParty: Party = { ...mockedParties[2], delegation: true };

const delegation = (overrides: Partial<DelegationWithInfo>): DelegationWithInfo => ({
  brokerId: 'broker1',
  id: 'id',
  institutionId: 'inst1',
  institutionName: 'Comune di Test',
  productId: 'prod-io',
  type: TypeEnum.PT,
  ...overrides,
});

const pageInfo = { pageNo: 0, pageSize: 10, totalElements: 0, totalPages: 1 };

const renderTable = (party: Party = ptParty) => {
  const store = createStore();
  store.dispatch(partiesActions.setPartySelectedProducts(mockedPartyProducts));
  return renderWithProviders(<TechnologyPartnerTable party={party} />, store);
};

describe('TechnologyPartnerTable', () => {
  test('merges delegations of the same broker and institution into a single row', async () => {
    mockedGetDelegatingInstitutions.mockResolvedValue({
      delegations: [
        delegation({ id: '1', productId: 'prod-io' }),
        delegation({ id: '2', productId: 'prod-pagopa' }),
        delegation({ id: '3', institutionId: 'inst2', institutionName: 'Comune di Altro' }),
      ],
      pageInfo,
    });
    renderTable();

    expect(document.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
    expect(await screen.findByText('Comune di Test')).toBeInTheDocument();
    expect(screen.getByText('Comune di Altro')).toBeInTheDocument();
    // header + 2 merged rows
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(mockedGetDelegatingInstitutions).toHaveBeenCalledWith(ptParty.partyId);
  });

  test('does not render the table when the party is not a delegation party', async () => {
    mockedGetDelegatingInstitutions.mockResolvedValue({
      delegations: [delegation({ id: '1' })],
      pageInfo,
    });
    renderTable({ ...ptParty, delegation: false });

    await waitFor(() =>
      expect(document.querySelector('.MuiCircularProgress-root')).not.toBeInTheDocument()
    );
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Non sei stato ancora delegato da nessun ente.')
    ).not.toBeInTheDocument();
  });

  test.each([
    ['empty delegations', { delegations: [], pageInfo }],
    ['missing delegations', { pageInfo }],
  ])('shows the empty label with %s', async (_label, response) => {
    mockedGetDelegatingInstitutions.mockResolvedValue(response);
    renderTable();

    expect(
      await screen.findByText('Non sei stato ancora delegato da nessun ente.')
    ).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('shows the empty label and dispatches an error when the request fails', async () => {
    mockedGetDelegatingInstitutions.mockRejectedValue(new Error('error'));
    const { store } = renderTable();

    expect(
      await screen.findByText('Non sei stato ancora delegato da nessun ente.')
    ).toBeInTheDocument();
    const errors = store.getState().appState.errors;
    expect(errors).toHaveLength(1);
    expect(errors[0].id).toMatch(`FETCH_PARTY_PT_ERROR-${ptParty.partyId}`);
    expect(errors[0].blocking).toBe(false);
  });
});
