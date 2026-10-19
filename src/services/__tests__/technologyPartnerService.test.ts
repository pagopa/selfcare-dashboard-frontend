/* eslint-disable functional/no-let, functional/immutable-data */
import type { Mock } from 'vitest';
import { DashboardApi } from '../../api/DashboardApiClient';
import {
  getDelegatingInstitutions,
  mockedDelegationsWithPagination,
} from '../technologyPartnerService';

vi.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: {
    getDelegatingInstitutions: vi.fn(),
  },
}));

const originalMockProducts = import.meta.env.VITE_API_MOCK_PRODUCTS;

beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  import.meta.env.VITE_API_MOCK_PRODUCTS = originalMockProducts;
});

describe('technologyPartnerService', () => {
  test('mockedDelegationsWithPagination contains generated delegations', () => {
    const delegations = mockedDelegationsWithPagination.delegations ?? [];
    expect(delegations).toHaveLength(101);
    delegations.forEach((d) => {
      expect(d.id).toBeDefined();
      expect(d.createdAt).toBeInstanceOf(Date);
    });
  });

  test('returns mocked delegations in mock mode', async () => {
    import.meta.env.VITE_API_MOCK_PRODUCTS = 'true';

    await expect(getDelegatingInstitutions('p1')).resolves.toBe(mockedDelegationsWithPagination);
    expect(DashboardApi.getDelegatingInstitutions).not.toHaveBeenCalled();
  });

  test('calls DashboardApi.getDelegatingInstitutions otherwise', async () => {
    import.meta.env.VITE_API_MOCK_PRODUCTS = 'false';
    const response = { delegations: [], pageInfo: { pageNo: 0 } };
    (DashboardApi.getDelegatingInstitutions as Mock).mockResolvedValue(response);

    await expect(getDelegatingInstitutions('p1')).resolves.toEqual(response);
    expect(DashboardApi.getDelegatingInstitutions).toHaveBeenCalledWith('p1');
  });
});
