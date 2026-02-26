import { usePermissions } from '@pagopa/selfcare-common-frontend';
import useReduxCachedValue from '@pagopa/selfcare-common-frontend/hooks/useReduxCachedValue';
import { useAppSelector } from '../../redux/hooks';
import { fetchProductRoles } from '../../services/productService';
import { useProductsRolesMap } from '../useProductsRolesMap';

jest.mock('../../redux/hooks', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib', () => ({
  usePermissions: jest.fn(),
}));

jest.mock('@pagopa/selfcare-common-frontend/lib/hooks/useReduxCachedValue', () => jest.fn());

jest.mock('../../services/productService', () => ({
  fetchProductRoles: jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useMemo: jest.fn((fn) => fn()),
}));

describe('useProductsRolesMap', () => {
  const mockHasPermission = jest.fn();
  const mockUseReduxCachedValue = jest.fn();
  const mockFetchProductRoles = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (usePermissions as jest.Mock).mockReturnValue({
      hasPermission: mockHasPermission,
    });
    (useReduxCachedValue as jest.Mock).mockImplementation(mockUseReduxCachedValue);
    (fetchProductRoles as jest.Mock).mockResolvedValue([]);

    (useAppSelector as jest.Mock)
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
    (useAppSelector as jest.Mock)
      .mockImplementationOnce(() => ({ products: [] }))
      .mockImplementationOnce(() => [])
      .mockImplementationOnce(() => ({}));

    useProductsRolesMap();

    expect(fetchProductRoles).not.toHaveBeenCalled();
  });
});
