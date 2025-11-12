import { useMediaQuery } from '@mui/material';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardAdminPage from '../DasboardAdmin';

// --- Mock external modules ---

jest.mock('@mui/material/useMediaQuery');

describe('DashboardAdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    renderWithProviders(<DashboardAdminPage />);
  });

  it('renders mobile menu when isMobile is true', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(true);
    renderWithProviders(<DashboardAdminPage />);
  });

  it('renders desktop menu when isMobile is false', () => {
    (useMediaQuery as jest.Mock).mockReturnValue(false);
    renderWithProviders(<DashboardAdminPage />);
  });
});
