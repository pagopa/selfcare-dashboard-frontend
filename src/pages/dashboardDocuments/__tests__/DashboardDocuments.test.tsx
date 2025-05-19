import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { fireEvent, screen } from '@testing-library/react';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardDocumentsPage from '../DashboardDocumentsPage';

test('should render component DashboardDocuments', async () => {
  const { store } = renderWithProviders(
    <DashboardDocumentsPage party={mockedParties[2]} products={mockedPartyProducts} />
  );

  const mockedActions = mockedParties[2].products
    .filter((product) => product.productOnBoardingStatus === 'ACTIVE')
    .map((product) => ({
      productId: product.productId ?? '',
      actions: product.userProductActions ? [...product.userProductActions] : [],
    }));
  store.dispatch(setProductPermissions(mockedActions));

  const documenTitle = await screen.findByText('Documenti');

  expect(documenTitle).toBeInTheDocument();
  screen.debug();

  const seeMoreButtons = await screen.findAllByText('Vedi di più');

  expect(seeMoreButtons[1]).toBeInTheDocument();
  fireEvent.click(seeMoreButtons[1]);
});
