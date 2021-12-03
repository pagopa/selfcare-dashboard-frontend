import { mockedParties } from '../__mocks__/partyService';
import { DashboardApi } from '../../api/DashboardApiClient';
import { retrieveTokenExchange } from '../tokenExchangeService';
import { mockedPartyProducts } from '../__mocks__/productService';

jest.mock('../../api/DashboardApiClient');

beforeEach(() => {
  jest.spyOn(DashboardApi, 'getTokenExchange');
});

test('Test retrieveTokenExchange', async () => {
  const token = await retrieveTokenExchange('url', mockedParties[0], mockedPartyProducts[0]);

  expect(token).toBe('DUMMYTOKEN');

  expect(DashboardApi.getTokenExchange).toBeCalledTimes(1);
  expect(DashboardApi.getTokenExchange).toBeCalledWith(
    'url',
    mockedParties[0].institutionId,
    mockedPartyProducts[0].id
  );
});
