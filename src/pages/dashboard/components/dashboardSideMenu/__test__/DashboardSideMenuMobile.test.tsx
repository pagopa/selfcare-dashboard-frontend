import { fireEvent, screen } from '@testing-library/react';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import DashboardSideMenuMobile from '../DashboardSideMenuMobile';

const renderMobile = (drawerOpen: boolean, setDrawerOpen = vi.fn()) => {
  renderWithProviders(
    <DashboardSideMenuMobile
      party={mockedParties[0]}
      isAddDelegateSectionVisible={false}
      isInvoiceSectionVisible={false}
      isHandleDelegationsVisible={false}
      isDocumentsSectionVisible={false}
      drawerOpen={drawerOpen}
      setDrawerOpen={setDrawerOpen}
      hideLabels={false}
      currentPathname="/dashboard/1/users"
    />
  );
  return setDrawerOpen;
};

describe('DashboardSideMenuMobile', () => {
  it('shows the current section label and opens the drawer', () => {
    const setDrawerOpen = renderMobile(false);
    fireEvent.click(screen.getByRole('button', { name: /Utenti/ }));
    expect(setDrawerOpen).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('closes the drawer on escape', () => {
    const setDrawerOpen = renderMobile(true);
    const drawer = screen.getByRole('presentation');
    expect(drawer).toBeInTheDocument();
    fireEvent.keyDown(drawer, { key: 'Escape' });
    expect(setDrawerOpen).toHaveBeenCalledWith(false);
  });
});
