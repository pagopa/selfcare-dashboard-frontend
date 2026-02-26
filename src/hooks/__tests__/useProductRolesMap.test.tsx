import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import useReduxCachedValue from '@pagopa/selfcare-common-frontend/lib/hooks/useReduxCachedValue';
import { useAppSelector } from '../../redux/hooks';
import { fetchProductRoles } from '../../services/productService';
import { useProductsRolesMap } from '../useProductsRolesMap';

vi.mock('../../redux/hooks', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  usePermissions: vi.fn(),
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/hooks/useReduxCachedValue', () => vi.fn());

vi.mock('../../services/productService', () => ({
  fetchProductRoles: vi.fn(),
}));

vi.mock('react', () => ({
  ...vi.requireActual('react'),
  useMemo: vi.fn((fn) => fn()),
}));

describe('useProductsRolesMap', () => {
  const mockHasPermission = vi.fn();
  const mockUseReduxCachedValue = vi.fn();
  const mockFetchProductRoles = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (usePermissions as vi.Mock).mockReturnValue({
      hasPermission: mockHasPermission,
    });
    (useReduxCachedValue as vi.Mock).mockImplementation(mockUseReduxCachedValue);
    (fetchProductRoles as vi.Mock).mockResolvedValue([]);

    (useAppSelector as vi.Mock)
      .mockImplementationOnce(() => ({
        id: 'test-party',
        products: [
          {
            productId: 'product1',
            productOnBoardingStatus: 'ACTIVE',
          },
        ],
      }))
      .mockImplementationOnce(() => [
        {
          id: 'product1',
          name: 'Test Product',
        },
      ])
      .mockImplementationOnce(() => ({}));
  });

  it('should skip product role fetch if no active and accessible products', async () => {
    (useAppSelector as vi.Mock)
      .mockImplementationOnce(() => ({ products: [] }))
      .mockImplementationOnce(() => [])
      .mockImplementationOnce(() => ({}));

    useProductsRolesMap();

    expect(fetchProductRoles).not.toHaveBeenCalled();
  });
});
