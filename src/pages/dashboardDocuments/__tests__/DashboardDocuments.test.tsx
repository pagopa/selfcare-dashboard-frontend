import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { act, fireEvent, screen } from '@testing-library/react';
import { ENV } from '../../../utils/env';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardDocumentsPage from '../DashboardDocumentsPage';

afterEach(() => vi.restoreAllMocks());

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
  act(() => {
    store.dispatch(setProductPermissions(mockedActions));
  });

  const documenTitle = await screen.findByText('Documenti');

  expect(documenTitle).toBeInTheDocument();

  const seeMoreButtons = await screen.findAllByText('Vedi di più');

  expect(seeMoreButtons[1]).toBeInTheDocument();
  fireEvent.click(seeMoreButtons[1]);
});

test.each([true, false])(
  'keeps document navigation without a temporary wizard entry (development: %s)',
  async (isDev) => {
    vi.spyOn(ENV, 'IS_DEVELOPMENT', 'get').mockReturnValue(isDev);
    const party = mockedParties[2];
    const { store, history } = renderWithProviders(
      <DashboardDocumentsPage party={party} products={mockedPartyProducts} />
    );
    act(() => {
      store.dispatch(
        setProductPermissions(
          party.products
            .filter((product) => product.productOnBoardingStatus === 'ACTIVE')
            .map((product) => ({
              productId: product.productId ?? '',
              actions: product.userProductActions ? [...product.userProductActions] : [],
            }))
        )
      );
    });
    const documentLinks = await screen.findAllByRole('button', { name: 'Vedi di più' });
    expect(documentLinks.length).toBeGreaterThan(0);
    const wizardLinks = screen.queryAllByRole('button', { name: 'Prova aggiornamento contratto' });
    expect(wizardLinks).toHaveLength(0);
    fireEvent.click(documentLinks[0]);
    expect(history.location.pathname).toBe(`/dashboard/${party.partyId}/documents/details`);
    expect(new URLSearchParams(history.location.search).get('productId')).toBeTruthy();
  }
);
