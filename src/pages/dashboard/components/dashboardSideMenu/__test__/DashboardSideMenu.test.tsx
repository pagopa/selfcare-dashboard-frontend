import { fireEvent, screen } from '@testing-library/react';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import DashboardSideMenu from '../DashboardSideMenu';

test('Test: Access to the dashboard side menu voices', async () => {
  const { history } = renderWithProviders(
    <DashboardSideMenu
      party={mockedParties[2]}
      canSeeSection={true}
      isInvoiceSectionVisible={true}
      isDelegateSectionVisible={true}
      isPtSectionVisible={false}
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
  expect(history.location.pathname).toBe(`/dashboard/${mockedParties[2].partyId}`);

  fireEvent.click(delegationBtn);
  expect(history.location.pathname).toBe(`/dashboard/${mockedParties[2].partyId}/delegations`);

  fireEvent.click(referentsBtn);
  expect(history.location.pathname).toBe(`/dashboard/${mockedParties[2].partyId}/users`);

  fireEvent.click(groupsBtn);
  expect(history.location.pathname).toBe(`/dashboard/${mockedParties[2].partyId}/groups`);
});

test('Test: The techpartner has not been delegated by any body, will not see the menu section and will not be able to access it', async () => {
  renderWithProviders(
    <DashboardSideMenu
      party={mockedParties[7]}
      canSeeSection={false}
      isInvoiceSectionVisible={false}
      isDelegateSectionVisible={false}
      isPtSectionVisible={false}
    />
  );
  const institutionsListVoice = screen.queryByText('Enti gestiti');

  expect(institutionsListVoice).not.toBeInTheDocument();
});

test('Test: The techpartner has not been delegated by any body, he will see the menu section and will be able to access it', async () => {
  console.log('mockedParties[16]', mockedParties[16]);
  const { history } = renderWithProviders(
    <DashboardSideMenu
      party={mockedParties[16]}
      canSeeSection={false}
      isInvoiceSectionVisible={false}
      isDelegateSectionVisible={false}
      isPtSectionVisible={true}
    />
  );

  

  const institutionsListVoice = screen.getByText('Enti gestiti');

  expect(institutionsListVoice).toBeInTheDocument();

  fireEvent.click(institutionsListVoice);
  expect(history.location.pathname).toBe(`/dashboard/${mockedParties[16].partyId}/delegate`);
});
