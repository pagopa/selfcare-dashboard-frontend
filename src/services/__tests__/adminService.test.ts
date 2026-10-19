/* eslint-disable functional/no-let, functional/immutable-data */
import type { Mock } from 'vitest';
import { DashboardApi } from '../../api/DashboardApiClient';
import { COMMON_ADMIN_ACTIONS, getPermissionsAdminService } from '../adminService';

vi.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: {
    myPermissionsAdmin: vi.fn(),
  },
}));

const originalMockRequestData = process.env.VITE_API_MOCK_REQUEST_DATA;

beforeEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  process.env.VITE_API_MOCK_REQUEST_DATA = originalMockRequestData;
});

describe('getPermissionsAdminService', () => {
  test('returns mocked permissions when VITE_API_MOCK_REQUEST_DATA is true', async () => {
    process.env.VITE_API_MOCK_REQUEST_DATA = 'true';

    const result = await getPermissionsAdminService();

    expect(result.items?.map((i) => i.productId)).toEqual(['ALL', 'prod-pn', 'prod-io']);
    result.items?.forEach((item) => {
      expect(item.role).toBe('mocked-role');
      expect(item.permissions).toEqual(COMMON_ADMIN_ACTIONS);
    });
    expect(DashboardApi.myPermissionsAdmin).not.toHaveBeenCalled();
  });

  test('calls DashboardApi.myPermissionsAdmin otherwise', async () => {
    process.env.VITE_API_MOCK_REQUEST_DATA = 'false';
    const permissions = { items: [{ productId: 'prod-io', role: 'admin', permissions: [] }] };
    (DashboardApi.myPermissionsAdmin as Mock).mockResolvedValue(permissions);

    await expect(getPermissionsAdminService()).resolves.toEqual(permissions);
    expect(DashboardApi.myPermissionsAdmin).toHaveBeenCalledTimes(1);
  });
});
