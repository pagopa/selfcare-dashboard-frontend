import React from 'react';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import NotActiveProductsSection from '../NotActiveProductsSection';

describe('NotActiveProductsSection test suite', () => {
  test('NotActiveProductsSection render', () => {
    renderWithProviders(
      <NotActiveProductsSection filteredProducts={[]} party={mockedParties[0]} />
    );
  });

  test('NotActiveProductsSection render with products', () => {
    renderWithProviders(
      <NotActiveProductsSection filteredProducts={mockedPartyProducts} party={mockedParties[1]} />
    );
  });

  test('NotActiveProductsSection render with products', () => {
    renderWithProviders(
      <NotActiveProductsSection filteredProducts={mockedPartyProducts} party={mockedParties[3]} />
    );
  });
});
