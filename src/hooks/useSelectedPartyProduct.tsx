import { useMemo } from 'react';
import { Product } from '../model/Product';

export const useSelectedPartyProduct = (
  productId: string,
  products: Array<Product>
): Product | undefined =>
  useMemo(() => (productId ? products.find((p) => p.id === productId) : undefined), [productId]);
