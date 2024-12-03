import React from 'react';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardHandleDelegatesPage from '../DashboardHandleDelegatesPage';
import { fireEvent, screen } from '@testing-library/react';

test('Should render component DashboardHandleDelegatesPage with populated props', async () => {
  const mockedPartyRoma = mockedParties[2];
  renderWithProviders(<DashboardHandleDelegatesPage party={mockedPartyRoma} />);
});

