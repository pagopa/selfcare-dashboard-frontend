import { cleanup } from '@testing-library/react';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardDelegationsPage from '../DashboardDelegationsPage';

afterEach(() => {
  cleanup();
});

test('Should render component DashboardDelegationsPage with populated props and isAddDelegateSectionVisible is true', async () => {
  const mockedGsp = mockedParties[11];
  renderWithProviders(
    <DashboardDelegationsPage party={mockedGsp} authorizedDelegableProducts={mockedPartyProducts} />
  );
});
