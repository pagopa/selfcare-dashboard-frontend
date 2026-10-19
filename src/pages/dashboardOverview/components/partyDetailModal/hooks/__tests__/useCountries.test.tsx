import { renderHook, waitFor } from '@testing-library/react';
import { ENV } from '../../../../../../utils/env';
import { useCountries } from '../useCountries';

const countries = [{ name: 'Regno Unito', alpha_2: 'GB' }];

describe('useCountries', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockResolvedValue({ json: () => Promise.resolve(countries) });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('fetches countries for a foreign institution', async () => {
    const { result } = renderHook(() => useCountries(true));

    await waitFor(() => expect(result.current).toEqual(countries));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(ENV.JSON_URL.COUNTRIES);
  });

  test('does not fetch countries for an italian institution', () => {
    const { result } = renderHook(() => useCountries(false));

    expect(result.current).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('does not fetch again once countries are loaded', async () => {
    const { result, rerender } = renderHook(({ foreign }) => useCountries(foreign), {
      initialProps: { foreign: true },
    });
    await waitFor(() => expect(result.current).toEqual(countries));

    rerender({ foreign: false });
    rerender({ foreign: true });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
