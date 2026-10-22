import { DashboardApi } from '../../api/DashboardApiClient';
import { mockedProductUserResource } from '../../api/__mocks__/DashboardApiClient';
import { fetchProductAdmins, PRODUCT_ADMIN_ROLES } from '../userService';

vi.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: { getProductUsers: vi.fn() },
}));

test('fetches the product admins and maps them to ProductUser', async () => {
  import.meta.env.VITE_API_MOCK_PARTIES = 'false';
  vi.mocked(DashboardApi.getProductUsers).mockResolvedValue([
    { ...mockedProductUserResource[0], fiscalCode: 'bncgli80a01h501y' },
    { id: 'user-2' },
  ]);

  const result = await fetchProductAdmins('party-1', 'prod-io');

  expect(DashboardApi.getProductUsers).toHaveBeenCalledWith('party-1', 'prod-io', [
    'DELEGATE',
    'SUB_DELEGATE',
    'MANAGER',
    'ADMIN_EA',
  ]);
  expect(PRODUCT_ADMIN_ROLES).toHaveLength(4);
  expect(result).toEqual([
    {
      id: '1',
      name: 'Name',
      surname: 'Surname',
      taxCode: 'BNCGLI80A01H501Y',
      email: 'address',
    },
    { id: 'user-2', name: '', surname: '', taxCode: '', email: '' },
  ]);
});

test('propagates the API errors', async () => {
  import.meta.env.VITE_API_MOCK_PARTIES = 'false';
  vi.mocked(DashboardApi.getProductUsers).mockRejectedValue(new Error('error'));
  await expect(fetchProductAdmins('party-1', 'prod-io')).rejects.toThrow('error');
});
