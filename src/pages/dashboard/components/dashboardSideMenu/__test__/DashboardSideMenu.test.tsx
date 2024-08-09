import { fireEvent, screen } from '@testing-library/react';
import { store } from '../../../../../redux/store';
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
      setDrawerOpen={jest.fn()}
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

test('Test: The techpartner has not been delegated by any body, will not see the menu section and will not be able to access it', async () => {
  renderWithProviders(
    <DashboardSideMenu
      party={mockedParties[7]}
      isInvoiceSectionVisible={false}
      isAddDelegateSectionVisible={false}
      isHandleDelegationsVisible={false}
      setDrawerOpen={jest.fn()}
    />
  );
  const institutionsListVoice = screen.queryByText('Enti gestiti');

  expect(institutionsListVoice).not.toBeInTheDocument();
});

test('Test: The techpartner has not been delegated by any body, he will see the menu section and will be able to access it', async () => {
  const { history } = renderWithProviders(
    <DashboardSideMenu
      party={mockedParties[16]}
      isInvoiceSectionVisible={false}
      isAddDelegateSectionVisible={false}
      isHandleDelegationsVisible={true}
      setDrawerOpen={jest.fn()}
    />
  );

  const institutionsListVoice = screen.getByText('Enti gestiti');

  expect(institutionsListVoice).toBeInTheDocument();

  fireEvent.click(institutionsListVoice);
  expect(history.location.pathname).toBe(`/dashboard/${mockedParties[16].partyId}/delegate`);
});
