import { DashboardApi } from '../api/DashboardApiClient';
import { Product, productResource2Product } from '../model/Product';
import { mockedPartyProducts } from './__mocks__/productService';

export const fetchProducts = (institutionId: string): Promise<Array<Product>> => {
  /* istanbul ignore if */
  if (process.env.REACT_APP_API_MOCK_PRODUCTS === 'true') {
    return new Promise((resolve) => resolve(mockedPartyProducts));
  } else {
    return DashboardApi.getProducts(institutionId).then((productResources) =>
      productResources ? productResources.map(productResource2Product) : []
    );
  }
};
