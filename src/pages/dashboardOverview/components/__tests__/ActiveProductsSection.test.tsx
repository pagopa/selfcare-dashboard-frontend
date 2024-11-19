import React from 'react';
import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../utils/test-utils';
import ActiveProductsSection from '../activeProductsSection/ActiveProductsSection';

test('should render component ActiveProductsSection empty props', () => {
  const mockedAgencyOnboarded = mockedParties[4];
  renderWithProviders(<ActiveProductsSection party={mockedAgencyOnboarded} products={[]} />);
});

test('should render component ActiveProductsSection', () => {
  const mockedAgencyOnboarded = mockedParties[4];
  renderWithProviders(
    <ActiveProductsSection party={mockedAgencyOnboarded} products={mockedPartyProducts} />
  );
});
