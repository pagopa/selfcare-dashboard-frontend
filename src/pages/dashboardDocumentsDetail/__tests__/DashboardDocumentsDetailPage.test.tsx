import { screen } from '@testing-library/react';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardDocumentsDetailPage from '../DashboardDocumentsDetailPage';

vi.mock('../../../services/partyService', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  getOnboardingInfo: vi.fn(() => Promise.resolve([])),
  getAttachmentStatusService: vi.fn(() => Promise.resolve({})),
}));

test('renders the documents detail page without crashing', async () => {
  window.history.pushState(
    {},
    '',
    '/dashboard/1/documents/details?productId=prod-io&productTitle=IO'
  );

  renderWithProviders(
    <DashboardDocumentsDetailPage party={mockedParties[0]} products={mockedPartyProducts} />
  );

  expect(await screen.findAllByText('IO')).not.toHaveLength(0);
  expect(screen.getByText('Documenti')).toBeInTheDocument();
});
