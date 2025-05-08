import { SvgIconComponent } from '@mui/icons-material';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Icon,
  useMediaQuery,
  useTheme,
} from '@mui/material';

type SideNavItemProps = {
  title: string;
  icon: SvgIconComponent;
  handleClick: () => void;
  isSelected?: boolean;
  hideLabels?: boolean;
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
}: Readonly<SideNavItemProps>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <ListItemButton
      selected={isSelected}
      onClick={handleClick}
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
    </ListItemButton>
  );
}