import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { store } from '../../redux/store';
import { PartyRegistryProxyApi } from '../PartyRegistryProxyApiClient';

const { mockedClient, createClientSpy } = vi.hoisted(() => {
  const client = { retrieveGeoTaxonomiesByDescriptionUsingGET: vi.fn() };
  return { mockedClient: client, createClientSpy: vi.fn(() => client) };
});

vi.mock('../generated/party-registry-proxy/client', () => ({
  createClient: createClientSpy,
}));

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    storageTokenOps: { ...actual.storageTokenOps, read: vi.fn(() => 'PRP_TOKEN') },
  };
});

const right = (status: number, value?: unknown) => ({ _tag: 'Right', right: { status, value } });

describe('PartyRegistryProxyApiClient', () => {
  beforeEach(() => {
    mockedClient.retrieveGeoTaxonomiesByDescriptionUsingGET.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('createClient is configured with a withDefaults that adds the bearer token', () => {
    expect(createClientSpy).toHaveBeenCalledTimes(1);
    const config = (createClientSpy.mock.calls[0] as Array<any>)[0];
    expect(config.basePath).toBe('');

    const wrappedOperation = vi.fn((params) => params);
    config.withDefaults(wrappedOperation)({ description: 'Roma' });

    expect(storageTokenOps.read).toHaveBeenCalled();
    expect(wrappedOperation).toHaveBeenCalledWith({
      description: 'Roma',
      bearerAuth: 'Bearer PRP_TOKEN',
    });
  });

  test('getTaxonomiesByQuery calls the client with the description and returns the value', async () => {
    const taxonomies = [{ code: '058091', desc: 'Roma' }];
    mockedClient.retrieveGeoTaxonomiesByDescriptionUsingGET.mockResolvedValue(
      right(200, taxonomies)
    );

    const result = await PartyRegistryProxyApi.getTaxonomiesByQuery('Roma');

    expect(mockedClient.retrieveGeoTaxonomiesByDescriptionUsingGET).toHaveBeenCalledWith({
      description: 'Roma',
    });
    expect(result).toEqual(taxonomies);
  });

  test('getTaxonomiesByQuery throws on unexpected status', async () => {
    mockedClient.retrieveGeoTaxonomiesByDescriptionUsingGET.mockResolvedValue(right(500));

    await expect(PartyRegistryProxyApi.getTaxonomiesByQuery('Roma')).rejects.toThrow(
      'Unexpected HTTP status! Expected 200 obtained 500'
    );
  });

  test('getTaxonomiesByQuery on 401 dispatches the session expired error', async () => {
    vi.useFakeTimers();
    try {
      mockedClient.retrieveGeoTaxonomiesByDescriptionUsingGET.mockResolvedValue(right(401));

      void PartyRegistryProxyApi.getTaxonomiesByQuery('Roma');
      await vi.advanceTimersByTimeAsync(0);

      expect(store.getState().appState.errors).toEqual([
        expect.objectContaining({
          id: expect.stringMatching(/^tokenNotValid/),
          techDescription: 'token expired or not valid',
          blocking: false,
          toNotify: false,
        }),
      ]);
    } finally {
      vi.clearAllTimers();
      vi.useRealTimers();
    }
  });
});
