/* eslint-disable functional/no-let, functional/immutable-data */
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import type { Mock } from 'vitest';
import { DashboardApi } from '../../api/DashboardApiClient';
import { mockedParties } from '../__mocks__/partyService';
import { mockedPartyProducts } from '../__mocks__/productService';
import { getBillingToken, retrieveBackOfficeUrl } from '../tokenExchangeService';

vi.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: {
    tokenExchangeAdmin: vi.fn(),
    getBackOfficeUrl: vi.fn(),
    getBillingToken: vi.fn(),
  },
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', async (importOriginal) => {
  const actual: any = await importOriginal();
  return { ...actual, isPagoPaUser: vi.fn() };
});

const originalMockParties = import.meta.env.VITE_API_MOCK_PARTIES;

beforeEach(() => {
  vi.clearAllMocks();
  (DashboardApi.tokenExchangeAdmin as Mock).mockResolvedValue('https://admin/url');
  (DashboardApi.getBackOfficeUrl as Mock).mockResolvedValue('https://bo/url');
  (DashboardApi.getBillingToken as Mock).mockResolvedValue('REAL_TOKEN');
});

afterAll(() => {
  import.meta.env.VITE_API_MOCK_PARTIES = originalMockParties;
});

describe('retrieveBackOfficeUrl', () => {
  test('uses tokenExchangeAdmin for PagoPA users', async () => {
    (isPagoPaUser as Mock).mockReturnValue(true);

    const url = await retrieveBackOfficeUrl(mockedParties[0], mockedPartyProducts[0], 'test', 'it');

    expect(url).toBe('https://admin/url');
    expect(DashboardApi.tokenExchangeAdmin).toHaveBeenCalledWith(
      mockedParties[0].partyId,
      mockedPartyProducts[0].id,
      'test',
      'it'
    );
    expect(DashboardApi.getBackOfficeUrl).not.toHaveBeenCalled();
  });

  test('uses getBackOfficeUrl for non PagoPA users', async () => {
    (isPagoPaUser as Mock).mockReturnValue(false);

    const url = await retrieveBackOfficeUrl(mockedParties[0], mockedPartyProducts[0]);

    expect(url).toBe('https://bo/url');
    expect(DashboardApi.getBackOfficeUrl).toHaveBeenCalledWith(
      mockedParties[0].partyId,
      mockedPartyProducts[0].id,
      undefined,
      undefined
    );
    expect(DashboardApi.tokenExchangeAdmin).not.toHaveBeenCalled();
  });

  test.each([true, false])(
    'defaults missing party and product ids to empty strings (pagoPaUser=%s)',
    async (pagoPaUser) => {
      (isPagoPaUser as Mock).mockReturnValue(pagoPaUser);

      await retrieveBackOfficeUrl(undefined, undefined, 'prod', 'en');

      const api = pagoPaUser ? DashboardApi.tokenExchangeAdmin : DashboardApi.getBackOfficeUrl;
      expect(api).toHaveBeenCalledWith('', '', 'prod', 'en');
    }
  );
});

describe('getBillingToken', () => {
  test('returns a dummy token in mock mode', async () => {
    import.meta.env.VITE_API_MOCK_PARTIES = 'true';

    await expect(getBillingToken(mockedParties[0].partyId)).resolves.toBe('DUMMYTOKEN');
    expect(DashboardApi.getBillingToken).not.toHaveBeenCalled();
  });

  test('calls DashboardApi.getBillingToken otherwise', async () => {
    import.meta.env.VITE_API_MOCK_PARTIES = 'false';

    await expect(getBillingToken('party-1', 'test', 'it')).resolves.toBe('REAL_TOKEN');
    expect(DashboardApi.getBillingToken).toHaveBeenCalledWith('party-1', 'test', 'it');
  });
});
