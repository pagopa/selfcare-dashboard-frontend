// import { DashboardApi } from '../api/DashboardApiClient';
import { Product /* , productResource2Product */ } from '../model/Product';
import { mockedPartyProducts } from './__mocks__/productService';

export const fetchProducts = (_institutionId: string): Promise<Array<Product>> =>
  /* DashboardApi.getProducts(institutionId).then(
    (_productResources) =>
       productResources ? productResources.map(productResource2Product) : [] */
  new Promise(
    (resolve) => resolve(mockedPartyProducts) // TODO fixme to restore functionality
  );
