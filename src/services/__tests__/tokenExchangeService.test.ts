import { mockedParties } from '../__mocks__/partyService';
import { getBillingToken, retrieveBackOfficeUrl } from '../tokenExchangeService';
import { mockedPartyProducts } from '../__mocks__/productService';

jest.mock('../tokenExchangeService');

const tokenExchangeService = require('../tokenExchangeService');

beforeEach(() => {
  jest.spyOn(tokenExchangeService, 'retrieveBackOfficeUrl');
  jest.spyOn(tokenExchangeService, 'getBillingToken');
});

test('Test retrieveTokenExchange', async () => {
  const url = await retrieveBackOfficeUrl(mockedParties[0], mockedPartyProducts[0]);

  expect(url).toBe('https://hostname/path?id=DUMMYTOKEN');

  expect(retrieveBackOfficeUrl).toBeCalledTimes(1);
});

test('getBillingToken', async () => {
  const url = await getBillingToken(mockedParties[0].partyId);

  expect(url).toBe('DUMMYTOKEN');

  expect(getBillingToken).toBeCalledTimes(1);
});
