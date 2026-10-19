import PeopleAlt from '@mui/icons-material/PeopleAlt';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../../utils/test-utils';
import DashboardSideNavItem from '../DashboardSidenavItem';

describe('DashboardSideNavItem', () => {
  it('renders the label and handles the click', () => {
    const handleClick = vi.fn();
    renderWithProviders(
      <DashboardSideNavItem
        title="Utenti"
        icon={PeopleAlt}
        handleClick={handleClick}
        itemKey="users"
        isSelected
      />
    );
    const item = screen.getByRole('button', { name: 'Utenti' });
    expect(item).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Utenti')).toBeInTheDocument();
    fireEvent.click(item);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('hides the label when hideLabels is true', () => {
    renderWithProviders(
      <DashboardSideNavItem
        title="Utenti"
        icon={PeopleAlt}
        handleClick={vi.fn()}
        itemKey="users"
        hideLabels
      />
    );
    expect(screen.getByRole('button', { name: 'Utenti' })).not.toHaveAttribute('aria-current');
    expect(screen.queryByText('Utenti')).not.toBeInTheDocument();
  });

  it('shows the exit icon for the admin page item outside the admin area', () => {
    renderWithProviders(
      <DashboardSideNavItem
        title="Dashboard"
        icon={PeopleAlt}
        handleClick={vi.fn()}
        itemKey="adminPage"
      />
    );
    expect(screen.getByTestId('ExitToAppIcon')).toBeInTheDocument();
  });
});
