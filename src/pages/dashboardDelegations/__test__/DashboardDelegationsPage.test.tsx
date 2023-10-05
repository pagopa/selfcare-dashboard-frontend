import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockedParties } from '../../../services/__mocks__/partyService';
import { mockedPartyProducts } from '../../../services/__mocks__/productService';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardDelegationsPage from '../DashboardDelegationsPage';

afterEach(() => {
  cleanup();
});

test('Should render component DashboardDelegationsPage with populated props and isDelegateSectionVisible is true', async () => {
  const mockedGsp = mockedParties[11];
  const { history } = renderWithProviders(
    <DashboardDelegationsPage
      party={mockedGsp}
      filteredAuthorizedProducts={mockedPartyProducts}
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
