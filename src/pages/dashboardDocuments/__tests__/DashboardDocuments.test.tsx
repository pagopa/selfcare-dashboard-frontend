import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardDocuments from '../DashboardDocuments';
test('should render component DashboardDocuments', () => {
  renderWithProviders(
    <DashboardDocuments party={mockedParties[2]} products={mockedPartyProducts} />
  );
});
