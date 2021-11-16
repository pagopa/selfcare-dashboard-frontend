import { mockedProductResources } from '../../api/__mocks__/DashboardApiClient';
import { DashboardApi } from '../../api/DashboardApiClient';
import { fetchProducts } from '../productService';
import { productResource2Product } from '../../model/Product';

jest.mock('../../api/DashboardApiClient');

beforeEach(() => {
  jest.spyOn(DashboardApi, 'getProducts');
});

test.skip('Test fetchProducts', async () => {
  // TODO remove skip after functionality restore
  const products = await fetchProducts('1');

  expect(products).toMatchObject(mockedProductResources.map(productResource2Product));

  expect(DashboardApi.getProducts).toBeCalledTimes(1);
});
