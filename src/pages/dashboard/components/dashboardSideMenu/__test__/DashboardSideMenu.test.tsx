import { fireEvent, screen } from '@testing-library/react';
import i18n from '@pagopa/selfcare-common-frontend/locale/locale-utils';
import { store } from '../../../../../redux/store';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import DashboardSideMenu from '../DashboardSideMenu';

beforeAll(() => {
  void i18n.changeLanguage('it');
});

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

test('Test: render with props false', async () => {
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

test('Test: The techpartner has not been delegated by any body, he will see the menu section and will be able to access it in empty state', async () => {
  const institutionPT = mockedParties.find((party) => party.description === 'Maggioli S.p.A.')!;

  const { history } = renderWithProviders(
    <DashboardSideMenu
      party={institutionPT}
      isInvoiceSectionVisible={false}
      isAddDelegateSectionVisible={false}
      isHandleDelegationsVisible={true}
      setDrawerOpen={jest.fn()}
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
      setDrawerOpen={jest.fn()}
    />
  );

  const institutionsListVoice = screen.getByText('Enti gestiti');

  expect(institutionsListVoice).toBeInTheDocument();

  fireEvent.click(institutionsListVoice);
  expect(history.location.pathname).toBe(`/dashboard/${institutionEA.partyId}/delegate`);
});
