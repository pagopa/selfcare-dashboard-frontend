/* eslint-disable functional/no-let, functional/immutable-data */
import type { Mock } from 'vitest';
import { DashboardApi } from '../../api/DashboardApiClient';
import { fetchDelegations, mockedDelegations } from '../delegationServices';
import { mockedParties } from '../__mocks__/partyService';

vi.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: {
    getDelegations: vi.fn(),
  },
}));

const originalMockProducts = import.meta.env.VITE_API_MOCK_PRODUCTS;

beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  import.meta.env.VITE_API_MOCK_PRODUCTS = originalMockProducts;
});

describe('fetchDelegations', () => {
  test('returns the mocked delegations of the party in mock mode', async () => {
    import.meta.env.VITE_API_MOCK_PRODUCTS = 'true';
    const partyId = mockedParties[2].partyId;

    const result = await fetchDelegations(partyId);

    expect(result).toEqual(mockedDelegations.filter((d) => d.institutionId === partyId));
    expect(result.length).toBeGreaterThan(0);
    expect(DashboardApi.getDelegations).not.toHaveBeenCalled();
  });

  test('calls DashboardApi.getDelegations otherwise', async () => {
    import.meta.env.VITE_API_MOCK_PRODUCTS = 'false';
    const delegations = [{ id: 'd1', institutionId: 'p1' }];
    (DashboardApi.getDelegations as Mock).mockResolvedValue(delegations);

    await expect(fetchDelegations('p1')).resolves.toEqual(delegations);
    expect(DashboardApi.getDelegations).toHaveBeenCalledWith('p1');
  });
});
