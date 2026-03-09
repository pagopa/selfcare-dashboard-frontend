import { usePermissions } from '@pagopa/selfcare-common-frontend/lib';
import useReduxCachedValue from '@pagopa/selfcare-common-frontend/lib/hooks/useReduxCachedValue';
import { Mock } from 'vitest';
import { useAppSelector } from '../../redux/hooks';
import { fetchProductRoles } from '../../services/productService';
import { useProductsRolesMap } from '../useProductsRolesMap';
// ---- redux hook
vi.mock('../../redux/hooks', () => ({
  useAppSelector: vi.fn(),
}));

// ---- selfcare common frontend (preserve other exports!)
vi.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  usePermissions: vi.fn(),
}));

// ---- redux cached value hook (default export!)
vi.mock('@pagopa/selfcare-common-frontend/lib/hooks/useReduxCachedValue', () => ({
  default: vi.fn(),
}));

// ---- service
vi.mock('../../services/productService', () => ({
  fetchProductRoles: vi.fn(),
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
