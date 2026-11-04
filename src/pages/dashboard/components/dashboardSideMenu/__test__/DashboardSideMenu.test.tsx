import { fireEvent, screen } from '@testing-library/react';
import { setProductPermissions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { createStore, store } from '../../../../../redux/store';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import DashboardSideMenu from '../DashboardSideMenu';

test('Test: Access to the dashboard side menu voices', async () => {
  const { history } = renderWithProviders(
    <DashboardSideMenu
      party={mockedParties[2]}
      isInvoiceSectionVisible={true}
      isAddDelegateSectionVisible={true}
      isHandleDelegationsVisible={false}
      setDrawerOpen={vi.fn()}
    />,
    store
  );

  const overviewBtn = screen.getAllByText('Panoramica')[0];
  const delegationBtn = await screen.findByText('Deleghe');

  expect(overviewBtn).toBeInTheDocument();
  expect(delegationBtn).toBeInTheDocument();

  fireEvent.click(overviewBtn);
  expect(history.location.pathname).toBe(`/dashboard/${mockedParties[2].partyId}`);

  fireEvent.click(delegationBtn);
  expect(history.location.pathname).toBe(`/dashboard/${mockedParties[2].partyId}/delegations`);
});

test('Test: render with props false', async () => {
  renderWithProviders(
    <DashboardSideMenu
      party={mockedParties[7]}
      isInvoiceSectionVisible={false}
      isAddDelegateSectionVisible={false}
      isHandleDelegationsVisible={false}
      setDrawerOpen={vi.fn()}
    />
  );
  const institutionsListVoice = screen.queryByText('Enti gestiti');

  expect(institutionsListVoice).not.toBeInTheDocument();
});

test('Test: The techpartner has not been delegated by any body, he will see the menu section and will be able to access it in empty state', async () => {
  const institutionPT = mockedParties.find((party) => party.description === 'Maggioli S.p.A.')!;

  const { history } = renderWithProviders(
    <DashboardSideMenu
      party={institutionPT}
      isInvoiceSectionVisible={false}
      isAddDelegateSectionVisible={false}
      isHandleDelegationsVisible={true}
      setDrawerOpen={vi.fn()}
    />
  );

  const institutionsListVoice = screen.getByText('Enti gestiti');

  expect(institutionsListVoice).toBeInTheDocument();

  fireEvent.click(institutionsListVoice);
  expect(history.location.pathname).toBe(`/dashboard/${institutionPT.partyId}/delegate`);
});

test('Test: The Aggregator has been delegated will see the menu section and will be able to access it', async () => {
  const institutionEA = mockedParties.find((party) => party.description === 'AGENCY ONBOARDED')!;
  const { history } = renderWithProviders(
    <DashboardSideMenu
      party={institutionEA}
      isInvoiceSectionVisible={false}
      isAddDelegateSectionVisible={false}
      isHandleDelegationsVisible={true}
      setDrawerOpen={vi.fn()}
    />
  );

  const institutionsListVoice = screen.getByText('Enti gestiti');

  expect(institutionsListVoice).toBeInTheDocument();

  fireEvent.click(institutionsListVoice);
  expect(history.location.pathname).toBe(`/dashboard/${institutionEA.partyId}/delegate`);
});

test('Test: the divider separates the users and groups items from the other ones', () => {
  const testStore = createStore();
  testStore.dispatch(
    setProductPermissions([
      { productId: 'prod-io', actions: ['Selc:ListProductUsers', 'Selc:ListProductGroups'] },
    ])
  );
  renderWithProviders(
    <DashboardSideMenu
      party={mockedParties[2]}
      isInvoiceSectionVisible={false}
      isAddDelegateSectionVisible={true}
      setDrawerOpen={vi.fn()}
    />,
    testStore
  );

  const divider = screen.getByTestId('sidenav-divider');
  const isFollowedBy = (a: Node, b: Node) =>
    a.compareDocumentPosition(b) === Node.DOCUMENT_POSITION_FOLLOWING;
  expect(isFollowedBy(screen.getByRole('button', { name: 'Deleghe' }), divider)).toBe(true);
  expect(isFollowedBy(divider, screen.getByRole('button', { name: 'Utenti' }))).toBe(true);
});
