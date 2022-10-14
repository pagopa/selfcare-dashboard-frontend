import { mockedParties } from '../__mocks__/partyService';
import { retrieveBackOfficeUrl } from '../tokenExchangeService';
import { mockedPartyProducts } from '../__mocks__/productService';

jest.mock('../tokenExchangeService');

beforeEach(() => {
  jest.spyOn(require('../tokenExchangeService'), 'retrieveBackOfficeUrl');
});

test('Test retrieveTokenExchange', async () => {
  const url = await retrieveBackOfficeUrl(mockedParties[0], mockedPartyProducts[0]);

  expect(url).toBe('https://hostname/path?id=DUMMYTOKEN');

  expect(retrieveBackOfficeUrl).toBeCalledTimes(1);
});
