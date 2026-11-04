import type { SvgIconComponent } from '@mui/icons-material';
import ExitToApp from '@mui/icons-material/ExitToApp';
import {
  Box,
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
  const { blue, neutral } = theme.colors;

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
        display: hideLabels ? 'grid' : 'flex',
        justifyContent: hideLabels ? 'center' : undefined,
        gap: 1,
        px: 3,
        py: 2,
        '& .MuiListItemIcon-root, & .MuiListItemText-root': { color: neutral.black },
        '& .MuiListItemIcon-root + .MuiListItemText-root': { ml: 0 },
        '&.Mui-selected, &.Mui-selected:hover': {
          backgroundColor: blue[50],
          borderRight: `4px solid ${blue[500]}`,
          pr: 2.5,
        },
        '&.Mui-selected .MuiListItemIcon-root, &.Mui-selected .MuiListItemText-root': {
          color: blue[500],
        },
      }}
    >
      <ListItemIcon>
        <Icon component={icon} />
      </ListItemIcon>

      {!hideLabels && <ListItemText primary={title} />}
      {isSelected && !hideLabels && (
        <Box
          data-testid="sidenav-selected-dot"
          aria-hidden
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 24,
            height: 24,
            flexShrink: 0,
          }}
        >
          <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: blue[500] }} />
        </Box>
      )}
      {itemKey === 'adminPage' && !isAdminArea && !hideLabels && (
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
      )}
    </ListItemButton>
  );
}
