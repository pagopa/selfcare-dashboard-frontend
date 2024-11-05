import React from 'react';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardHandleDelegatesPage from '../dashboardHandleDelegatesPage';

test('Should render component DashboardHandleDelegatesPage with populated props', async () => {
  const mockedAgencyOnboarded = mockedParties[4];
  renderWithProviders(<DashboardHandleDelegatesPage party={mockedAgencyOnboarded} />);
});

