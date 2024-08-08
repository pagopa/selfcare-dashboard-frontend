import { screen } from '@testing-library/react';
import React from 'react';
import { mockedParties } from '../../../../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../../../../utils/test-utils';
import PartyDetail from '../PartyDetail';

test('render partyDetail modal', async () => {
  const mockedPa = mockedParties[1];

  renderWithProviders(<PartyDetail party={mockedPa} />);

  const ipaCode = await screen.findByText('originId1');

  expect(ipaCode).toBeInTheDocument();
});
