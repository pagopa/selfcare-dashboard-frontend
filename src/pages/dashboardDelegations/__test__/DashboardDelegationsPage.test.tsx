import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardDelegationsPage from '../DashboardDelegationsPage';

afterEach(() => {
  cleanup();
});

describe('DashboardDelegationsPage', () => {
  test('Should render generic Error message when DashboardDelegationsPage prop isDelegateSectionVisible is undefined', async () => {
    renderWithProviders(
      <DashboardDelegationsPage
        party={{
          partyId: '',
          products: [],
          externalId: undefined,
          originId: undefined,
          origin: undefined,
          description: '',
          digitalAddress: undefined,
          category: undefined,
          urlLogo: undefined,
          fiscalCode: undefined,
          registeredOffice: '',
          zipCode: '',
          typology: '',
          institutionType: undefined,
          recipientCode: undefined,
          geographicTaxonomies: [],
          vatNumberGroup: undefined,
          supportEmail: undefined,
          vatNumber: undefined,
          subunitCode: undefined,
          subunitType: undefined,
          aooParentCode: undefined,
          parentDescription: undefined,
          userRole: undefined,
          status: undefined,
        }}
        delegableProducts={[]}
      />
    );
    const ErrorMessage = await screen.findByText('Errore');
    expect(ErrorMessage).toBeInTheDocument();
  });

  test('Should render component DashboardDelegationsPage with populated props and isDelegateSectionVisible is true', async () => {
    const mockedGsp = mockedParties[11];
    const { history } = renderWithProviders(
      <DashboardDelegationsPage
        party={mockedGsp}
        delegableProducts={mockedPartyProducts}
        isDelegateSectionVisible
      />
    );
      // test back button
    const backBtn = await screen.findByText('Indietro');
    const goBackMock = jest.spyOn(history, 'goBack');

    await act(async () => {
      fireEvent.click(backBtn);
    });

    // Assert that history.goBack() was called
    expect(goBackMock).toHaveBeenCalled();

    goBackMock.mockRestore();
  });
});
