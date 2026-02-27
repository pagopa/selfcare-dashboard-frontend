import { mockedParties } from '../../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../../utils/test-utils';
import AddDelegationPage from '../AddDelegationPage';

test('should render component AddDelegationPage empty props', () => {
  const mockedAgencyOnboarded = mockedParties[4];
  renderWithProviders(
    <AddDelegationPage authorizedDelegableProducts={[]} party={mockedAgencyOnboarded} />
  );
});

test('should render component AddDelegationPage with populated props', () => {
  const mockedAgencyOnboarded = mockedParties[4];
  renderWithProviders(
    <AddDelegationPage
      authorizedDelegableProducts={mockedPartyProducts.filter((p) => p.delegable)}
      party={mockedAgencyOnboarded}
    />
  );
});
