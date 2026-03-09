import { mockedParties } from '../__mocks__/partyService';
import { mockedPartyProducts } from '../__mocks__/productService';
import { getBillingToken, retrieveBackOfficeUrl } from '../tokenExchangeService';
import type { Mock } from 'vitest';

vi.mock('../tokenExchangeService', () => ({
  retrieveBackOfficeUrl: vi.fn(),
  getBillingToken: vi.fn(),
}));

const mockedRetrieveBackOfficeUrl = retrieveBackOfficeUrl as Mock;
const mockedGetBillingToken = getBillingToken as Mock;

beforeEach(() => {
  mockedRetrieveBackOfficeUrl.mockReset();
  mockedGetBillingToken.mockReset();
});

test('Test retrieveTokenExchange', async () => {
  mockedRetrieveBackOfficeUrl.mockResolvedValue(
    'https://hostname/path?id=DUMMYTOKEN'
  );

  const url = await retrieveBackOfficeUrl(
    mockedParties[0],
    mockedPartyProducts[0]
  );

  expect(url).toBe('https://hostname/path?id=DUMMYTOKEN');
  expect(mockedRetrieveBackOfficeUrl).toHaveBeenCalledTimes(1);
});

test('getBillingToken', async () => {
  mockedGetBillingToken.mockResolvedValue('DUMMYTOKEN');

  const url = await getBillingToken(mockedParties[0].partyId);

  expect(url).toBe('DUMMYTOKEN');
  expect(mockedGetBillingToken).toHaveBeenCalledTimes(1);
});