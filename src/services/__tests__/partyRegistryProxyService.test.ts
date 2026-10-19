import type { Mock } from 'vitest';
import { PartyRegistryProxyApi } from '../../api/PartyRegistryProxyApiClient';
import { retrieveGeotaxonomyFromDescription } from '../partyRegistryProxyService';

vi.mock('../../api/PartyRegistryProxyApiClient', () => ({
  PartyRegistryProxyApi: {
    getTaxonomiesByQuery: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('retrieveGeotaxonomyFromDescription', () => {
  test('maps the API resources keeping only code and desc', async () => {
    (PartyRegistryProxyApi.getTaxonomiesByQuery as Mock).mockResolvedValue([
      { code: '058091', desc: 'Roma - Comune', country: 'IT', enabled: true },
      { code: '015146', desc: 'Milano - Comune' },
    ]);

    const result = await retrieveGeotaxonomyFromDescription('Ro');

    expect(PartyRegistryProxyApi.getTaxonomiesByQuery).toHaveBeenCalledWith('Ro');
    expect(result).toEqual([
      { code: '058091', desc: 'Roma - Comune' },
      { code: '015146', desc: 'Milano - Comune' },
    ]);
  });

  test('returns an empty array when the API returns nothing', async () => {
    (PartyRegistryProxyApi.getTaxonomiesByQuery as Mock).mockResolvedValue(null);

    await expect(retrieveGeotaxonomyFromDescription('xyz')).resolves.toEqual([]);
  });

  test('propagates API errors', async () => {
    (PartyRegistryProxyApi.getTaxonomiesByQuery as Mock).mockRejectedValue(new Error('ko'));

    await expect(retrieveGeotaxonomyFromDescription('xyz')).rejects.toThrow('ko');
  });
});
