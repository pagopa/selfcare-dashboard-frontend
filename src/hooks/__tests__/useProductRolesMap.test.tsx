import { usePermissions } from '@pagopa/selfcare-common-frontend';
import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
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
  useMemo: vi.fn((fn) => fn()),
}));

describe('useProductsRolesMap', () => {
  const mockHasPermission = vi.fn();
  const mockUseReduxCachedValue = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (usePermissions as Mock).mockReturnValue({
      hasPermission: mockHasPermission,
    });
    (useReduxCachedValue as Mock).mockImplementation(mockUseReduxCachedValue);
    (fetchProductRoles as Mock).mockResolvedValue([]);

    (useAppSelector as Mock)
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
    (useAppSelector as Mock)
      .mockImplementationOnce(() => ({ products: [] }))
      .mockImplementationOnce(() => [])
      .mockImplementationOnce(() => ({}));

    useProductsRolesMap();

    expect(fetchProductRoles).not.toHaveBeenCalled();
  });
});
