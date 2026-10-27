import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { renderHook } from '@testing-library/react';
import { Mock } from 'vitest';
import { useIsPagoPaUser } from '../useIsPagoPaUser';

vi.mock('@pagopa/selfcare-common-frontend/lib/utils/storage', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  isPagoPaUser: vi.fn(),
}));

describe('useIsPagoPaUser', () => {
  it.each([true, false])('returns %s according to the logged user issuer', (value) => {
    (isPagoPaUser as Mock).mockReturnValue(value);
    const { result } = renderHook(() => useIsPagoPaUser());
    expect(result.current).toBe(value);
  });
});
