import { DashboardApi } from '../api/DashboardApiClient';
import { Product, productResource2Product } from '../model/Product';

export const fetchProducts = (institutionId: string): Promise<Array<Product>> =>
  DashboardApi.getProducts(institutionId).then((productResources) =>
    productResources ? productResources.map(productResource2Product) : []
  );
