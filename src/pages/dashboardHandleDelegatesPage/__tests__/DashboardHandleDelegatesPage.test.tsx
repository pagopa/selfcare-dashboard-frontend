import { screen } from '@testing-library/react';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardHandleDelegatesPage from '../DashboardHandleDelegatesPage';

test('Should render component DashboardHandleDelegatesPage with populated props', async () => {
  const mockedPartyRoma = mockedParties[2];
  renderWithProviders(<DashboardHandleDelegatesPage party={mockedPartyRoma} />);
  // findBy also waits for the delegations request started on mount
  expect(await screen.findByText('Enti gestiti')).toBeInTheDocument();
});

