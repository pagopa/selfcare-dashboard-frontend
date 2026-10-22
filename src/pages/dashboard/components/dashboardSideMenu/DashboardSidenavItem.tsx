import type { SvgIconComponent } from '@mui/icons-material';
import ExitToApp from '@mui/icons-material/ExitToApp';
import {
  Icon,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { matchPath, useLocation } from 'react-router-dom';
import { ENV } from '../../../../utils/env';

type SideNavItemProps = {
  title: string;
  icon: SvgIconComponent;
  handleClick: () => void;
  isSelected?: boolean;
  hideLabels?: boolean;
  itemKey: string;
};

/**
 * A reusable navigation item component for the dashboard sidebar
 */
export default function DashboardSideNavItem({
  title,
  icon,
  handleClick,
  isSelected = false,
  hideLabels = false,
  itemKey,
}: Readonly<SideNavItemProps>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { pathname } = useLocation();
  const isAdminArea = !!matchPath(pathname, { path: ENV.ROUTES.ADMIN });

  return (
    <ListItemButton
      selected={isSelected}
      onClick={handleClick}
      aria-label={title}
      aria-current={isSelected ? 'page' : undefined}
      sx={{
        height: '100%',
        backgroundColor: 'background.paper',
        width: isMobile ? '270px' : '100%',
        display: hideLabels ? 'grid' : '',
        justifyContent: hideLabels ? 'center' : '',
      }}
    >
      <ListItemIcon>
        <Icon component={icon} />
      </ListItemIcon>

      {!hideLabels && <ListItemText primary={title} />}
      {itemKey === 'adminPage' && !isAdminArea && !hideLabels && (
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
      )}
    </ListItemButton>
  );
}
