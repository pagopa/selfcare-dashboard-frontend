import { screen } from '@testing-library/react';
import React from 'react';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import PartyDetail from '../components/PartyDetail';

test('geotaxonomies should not be visible for AS', () => {
  const mockedInsuranceCompany = mockedParties[18];

  renderWithProviders(<PartyDetail party={mockedInsuranceCompany} />);

  expect(screen.queryByText('Area geografica')).not.toBeInTheDocument();
});
