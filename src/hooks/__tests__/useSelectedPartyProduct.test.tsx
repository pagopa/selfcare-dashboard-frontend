import { renderHook } from '@testing-library/react';
import { Product } from '../../model/Product';
import { useSelectedPartyProduct } from '../useSelectedPartyProduct';

const products = [{ id: 'prod-io' }, { id: 'prod-pn' }] as Array<Product>;

describe('useSelectedPartyProduct', () => {
  test('returns the product matching the productId', () => {
    const { result } = renderHook(() => useSelectedPartyProduct('prod-pn', products));
    expect(result.current).toBe(products[1]);
  });

  test('returns undefined when the productId is not found or empty', () => {
    expect(
      renderHook(() => useSelectedPartyProduct('missing', products)).result.current
    ).toBeUndefined();
    expect(renderHook(() => useSelectedPartyProduct('', products)).result.current).toBeUndefined();
  });
});
