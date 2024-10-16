import { DashboardApi } from '../../api/DashboardApiClient';
import { StatusEnum } from '../../api/generated/b4f-dashboard/ProductsResource';
import { Product, productResource2Product } from '../../model/Product';

import { mockedParties } from '../__mocks__/partyService';
import {
  fetchProductRoles,
  fetchProducts
} from '../productService';
import { fetchProductRoles as fetchProductRolesMocked, mockedPartyProducts } from './../__mocks__/productService';

// Mock the DashboardApi methods
jest.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: {
    getProducts: jest.fn(),
    getProductRoles: jest.fn()
  }
}));

jest.mock('../__mocks__/productService', () => ({
  fetchProductRoles: jest.fn()
}));

describe('productService tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProducts', () => {
    test('returns mocked products when REACT_APP_API_MOCK_PRODUCTS is true', async () => {
      process.env.REACT_APP_API_MOCK_PRODUCTS = 'true';
      const result = await fetchProducts();
      expect(result).toEqual(mockedPartyProducts);
    });
  
    test('calls DashboardApi.getProducts and maps the result when REACT_APP_API_MOCK_PRODUCTS is false', async () => {
      process.env.REACT_APP_API_MOCK_PRODUCTS = 'false';
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
            { environment: 'prod', url: 'http://bo.example.com/prod1' }
          ],
          urlPublic: 'http://example.com/prod1',
          tag: 'Tag1',
          logoBgColor: 'red',
          subProducts: [] 
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
            { environment: 'dev', url: 'http://bo.example.com/prod2' }
          ],
          urlPublic: 'http://example.com/prod2',
          tag: 'Tag2',
          logoBgColor: 'blue',
          subProducts: [] 
        }
      ];
  
      (DashboardApi.getProducts as jest.Mock).mockResolvedValue(mockProductResources);
  
      const expectedProducts = mockProductResources.map(productResource2Product);
      const result = await fetchProducts();
      expect(DashboardApi.getProducts).toHaveBeenCalled();
      expect(result).toEqual(expectedProducts);
    });
  });
  

  describe('fetchProductRoles', () => {
    const mockProduct: Product = {
      id: 'prod1',
      description: 'Product 1 Description',
      logo: 'logo1.png',
      title: 'Product 1',
      urlBO: 'http://bo.example.com/prod1',
      status: StatusEnum.ACTIVE,
      imageUrl: 'http://example.com/prod1.png',
      delegable: true
    };
  
    test('returns mocked product roles when REACT_APP_API_MOCK_PRODUCTS is true', async () => {
      process.env.REACT_APP_API_MOCK_PRODUCTS = 'true';
      const mockRoles = [
        {
          productId: 'prod1',
          partyRole: 'Admin',
          selcRole: 'User',
          multiroleAllowed: true,
          productRole: 'admin',
          title: 'Admin Role',
          description: 'Admin Role Description'
        }
      ];
      (fetchProductRolesMocked as jest.Mock).mockResolvedValue(mockRoles);
      
      const result = await fetchProductRoles(mockProduct, mockedParties[0]);
      expect(fetchProductRolesMocked).toHaveBeenCalledWith(mockProduct, mockedParties[0]);
      expect(result).toEqual(mockRoles);
    });
  
    test('calls DashboardApi.getProductRoles and maps the result when REACT_APP_API_MOCK_PRODUCTS is false', async () => {
      process.env.REACT_APP_API_MOCK_PRODUCTS = 'false';
      const mockApiResponse = [
        {
          partyRole: 'Admin',
          selcRole: 'User',
          multiroleAllowed: true,
          productRoles: [
            {
              code: 'admin',
              label: 'Admin Role',
              description: 'Admin Role Description'
            }
          ]
        }
      ];
      (DashboardApi.getProductRoles as jest.Mock).mockResolvedValue(mockApiResponse);
      
      const expectedRoles = [
        {
          productId: 'prod1',
          partyRole: 'Admin',
          selcRole: 'User',
          multiroleAllowed: true,
          productRole: 'admin',
          title: 'Admin Role',
          description: 'Admin Role Description'
        }
      ];
      const result = await fetchProductRoles(mockProduct, mockedParties[0]);
      expect(DashboardApi.getProductRoles).toHaveBeenCalledWith(mockProduct.id, mockedParties[0].institutionType);
      expect(result).toEqual(expectedRoles);
    });
  });
  
});