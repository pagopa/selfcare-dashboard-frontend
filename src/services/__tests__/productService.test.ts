import { Mock } from 'vitest';
import { DashboardApi } from '../../api/DashboardApiClient';
import { StatusEnum } from '../../api/generated/b4f-dashboard/ProductsResource';
import { Product, productResource2Product } from '../../model/Product';
import {
  mockedMultiRoleProductRolesResponse,
  mockedPartnerTechOnlyProductRolesResponse,
  mockedStandardProductRolesResponse,
} from '../../model/__mocks__/ProductRolesApiResponse';

import { mockedParties } from '../__mocks__/partyService';
import { fetchProductRoles, fetchProducts } from '../productService';
import {
  fetchProductRoles as fetchProductRolesMocked,
  mockedPartyProducts,
} from './../__mocks__/productService';

// Mock the DashboardApi methods
vi.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: {
    getProducts: vi.fn(),
    getProductRoles: vi.fn(),
  },
}));

vi.mock('../__mocks__/productService', async (importOriginal) => {
  // Import the actual module to retain its original exports
  const actual = await importOriginal<typeof import('../__mocks__/productService')>();

  return {
    ...actual, // Spread the original exports (which includes mockedPartyProducts)
    fetchProductRoles: vi.fn(), // Override specific functions as needed
  };
});

describe('productService tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchProducts', () => {
    test('returns mocked products when VITE_API_MOCK_PRODUCTS is true', async () => {
      import.meta.env.VITE_API_MOCK_PRODUCTS = 'true';
      const result = await fetchProducts();
      expect(result).toEqual(mockedPartyProducts);
    });

    test('calls DashboardApi.getProducts and maps the result when VITE_API_MOCK_PRODUCTS is false', async () => {
      import.meta.env.VITE_API_MOCK_PRODUCTS = 'false';
      const mockProductResources = [
        {
          id: 'prod1',
          description: 'Product 1 Description',
          logo: 'logo1.png',
          title: 'Product 1',
          urlBO: 'http://bo.example.com/prod1',
          status: StatusEnum.ACTIVE,
          imageUrl: 'http://example.com/prod1.png',
          delegable: true,
          backOfficeEnvironmentConfigurations: [
            { environment: 'prod', url: 'http://bo.example.com/prod1' },
          ],
          urlPublic: 'http://example.com/prod1',
          tag: 'Tag1',
          logoBgColor: 'red',
          subProducts: [],
        },
        {
          id: 'prod2',
          description: 'Product 2 Description',
          logo: 'logo2.png',
          title: 'Product 2',
          urlBO: 'http://bo.example.com/prod2',
          status: StatusEnum.INACTIVE,
          imageUrl: 'http://example.com/prod2.png',
          delegable: false,
          backOfficeEnvironmentConfigurations: [
            { environment: 'dev', url: 'http://bo.example.com/prod2' },
          ],
          urlPublic: 'http://example.com/prod2',
          tag: 'Tag2',
          logoBgColor: 'blue',
          subProducts: [],
        },
      ];

      (DashboardApi.getProducts as Mock).mockResolvedValue(mockProductResources);

      const expectedProducts = mockProductResources.map(productResource2Product);
      const result = await fetchProducts();
      expect(DashboardApi.getProducts).toHaveBeenCalled();
      expect(result).toEqual(expectedProducts);
    });
  });

  describe('fetchProductRoles', () => {
    const mockProduct: Product = {
      id: 'prod-pagopa',
      description: 'Product 1 Description',
      logo: 'logo1.png',
      title: 'Product 1',
      urlBO: 'http://bo.example.com/prod1',
      status: StatusEnum.ACTIVE,
      imageUrl: 'http://example.com/prod1.png',
      delegable: true,
    };

    test('returns mocked product roles when VITE_API_MOCK_PRODUCTS is true', async () => {
      import.meta.env.VITE_API_MOCK_PRODUCTS = 'true';
      const mockRoles = [
        {
          productId: 'prod1',
          partyRole: 'Admin',
          selcRole: 'User',
          multiroleGroups: ['group1', 'group2'],
          productRole: 'admin',
          title: 'Admin Role',
          description: 'Admin Role Description',
        },
      ];
      (fetchProductRolesMocked as Mock).mockResolvedValue(mockRoles);

      const result = await fetchProductRoles(mockProduct, mockedParties[0]);
      expect(fetchProductRolesMocked).toHaveBeenCalledWith(mockProduct, mockedParties[0]);
      expect(result).toEqual(mockRoles);
    });

    test.each([
      {
        name: 'standard-only',
        partyId: '1',
        expectedPartnerTechFlags: [false, false, false, false, false, false],
      },
      {
        name: 'partner-tech-only',
        partyId: '98123',
        expectedPartnerTechFlags: [true, true],
      },
      {
        name: 'multi-role',
        partyId: '3',
        expectedPartnerTechFlags: [false, false, false, false, false, false, true, true],
      },
    ])('uses the local mock for the $name case', async ({ partyId, expectedPartnerTechFlags }) => {
      const party = mockedParties.find(({ partyId: currentPartyId }) => currentPartyId === partyId);
      const product = mockedPartyProducts.find(({ id }) => id === 'prod-pagopa');

      expect(party).toBeDefined();
      expect(product).toBeDefined();

      const { fetchProductRoles: fetchProductRolesImplementation } =
        await vi.importActual<typeof import('../__mocks__/productService')>(
          '../__mocks__/productService'
        );
      const roles = await fetchProductRolesImplementation(product!, party!);

      expect(roles.map(({ partnerTechRole }) => partnerTechRole ?? false)).toEqual(
        expectedPartnerTechFlags
      );
    });

    test('calls DashboardApi.getProductRoles and maps the result when VITE_API_MOCK_PRODUCTS is false', async () => {
      import.meta.env.VITE_API_MOCK_PRODUCTS = 'false';
      const mockApiResponse = {
        roleMappings: [
          {
            partyRole: 'Admin',
            selcRole: 'User',
            productRoles: [
              {
                code: 'admin',
                label: 'Admin Role',
                description: 'Admin Role Description',
                multiroleGroups: ['group1', 'group2'],
              },
            ],
          },
        ],
      };
      (DashboardApi.getProductRoles as Mock).mockResolvedValue(mockApiResponse);

      const expectedRoles = [
        {
          productId: 'prod-pagopa',
          partyRole: 'Admin',
          selcRole: 'User',
          phasesAdditionAllowed: [],
          multiroleGroups: ['group1', 'group2'],
          productRole: 'admin',
          title: 'Admin Role',
          description: 'Admin Role Description',
          partnerTechRole: false,
        },
      ];
      const result = await fetchProductRoles(mockProduct, mockedParties[0]);
      expect(DashboardApi.getProductRoles).toHaveBeenCalledWith(
        mockProduct.id,
        mockedParties[0].products[0].institutionType
      );
      expect(result).toEqual(expectedRoles);
    });

    test('returns standard roles when currentUserRoles is not provided', async () => {
      import.meta.env.VITE_API_MOCK_PRODUCTS = 'false';
      (DashboardApi.getProductRoles as Mock).mockResolvedValue({
        roleMappings: mockedStandardProductRolesResponse.roleMappings,
        partnerTechRoleMappings: mockedStandardProductRolesResponse.partnerTechRoleMappings,
      });

      const result = await fetchProductRoles(mockProduct, mockedParties[0]);

      expect(result.map((role) => role.productRole)).toEqual(['admin']);
      expect(result.map((role) => role.partnerTechRole)).toEqual([false]);
    });

    test.each([
      {
        name: 'standard user',
        response: mockedStandardProductRolesResponse,
        expectedRoles: ['admin'],
      },
      {
        name: 'partner tech only user',
        response: mockedPartnerTechOnlyProductRolesResponse,
        expectedRoles: ['admin-pt'],
      },
      {
        name: 'multi-role user',
        response: mockedMultiRoleProductRolesResponse,
        expectedRoles: ['admin', 'admin-pt'],
      },
    ])('filters roles for a $name', async ({ response, expectedRoles }) => {
      import.meta.env.VITE_API_MOCK_PRODUCTS = 'false';
      (DashboardApi.getProductRoles as Mock).mockResolvedValue(response);

      const result = await fetchProductRoles(mockProduct, mockedParties[0]);

      expect(result.map((role) => role.productRole)).toEqual(expectedRoles);
      expect(result.map((role) => role.partnerTechRole)).toEqual(
        expectedRoles.map((role) => role === 'admin-pt')
      );
    });
  });
});
