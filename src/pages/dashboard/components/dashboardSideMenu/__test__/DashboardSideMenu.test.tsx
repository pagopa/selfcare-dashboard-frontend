import { fireEvent, screen } from '@testing-library/react';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import DashboardSideMenu from '../DashboardSideMenu';

test('on click of side menu items', async () => {
  const { history } = renderWithProviders(
    <DashboardSideMenu
      party={mockedParties[2]}
      canSeeSection={true}
      isInvoiceSectionVisible={true}
      isDelegateSectionVisible={true}
    />
  );

  const overviewBtn = screen.getAllByText('Panoramica')[0];
  const delegationBtn = await screen.findByText('Deleghe');
  const referentsBtn = await screen.findByText('Utenti');
  const groupsBtn = await screen.findByText('Gruppi');

  expect(overviewBtn).toBeInTheDocument();
  expect(delegationBtn).toBeInTheDocument();
  expect(referentsBtn).toBeInTheDocument();
  expect(groupsBtn).toBeInTheDocument();

  fireEvent.click(overviewBtn);
  expect(history.location.pathname).toBe('/dashboard/3');

  fireEvent.click(delegationBtn);
  expect(history.location.pathname).toBe('/dashboard/3/delegations');

  fireEvent.click(referentsBtn);
  expect(history.location.pathname).toBe('/dashboard/3/users');

  fireEvent.click(groupsBtn);
  expect(history.location.pathname).toBe('/dashboard/3/groups');
});

test('on click of side menu items for PT page', async () => {
  const { history } = renderWithProviders(
    <DashboardSideMenu
      party={mockedParties[7]}
      canSeeSection={false}
      isInvoiceSectionVisible={false}
      isDelegateSectionVisible={false}
    />
  );

  const institutionsListBtn = screen.getAllByText('I tuoi enti')[0];

  expect(institutionsListBtn).toBeInTheDocument();

  fireEvent.click(institutionsListBtn);
  expect(history.location.pathname).toBe('/dashboard/8/delegate');
});
