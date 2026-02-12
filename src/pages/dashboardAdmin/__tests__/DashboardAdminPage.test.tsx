import { useMediaQuery } from '@mui/material';
import { Mock } from 'vitest';
import { renderWithProviders } from '../../../utils/test-utils';
import DashboardAdminPage from '../DasboardAdmin';

// --- Mock external modules ---

vi.mock('@mui/material/useMediaQuery');

describe('DashboardAdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    (useMediaQuery as Mock).mockReturnValue(false);
    renderWithProviders(<DashboardAdminPage />);
  });

  it('renders mobile menu when isMobile is true', () => {
    (useMediaQuery as Mock).mockReturnValue(true);
    renderWithProviders(<DashboardAdminPage />);
  });

  it('renders desktop menu when isMobile is false', () => {
    (useMediaQuery as Mock).mockReturnValue(false);
    renderWithProviders(<DashboardAdminPage />);
  });
});
