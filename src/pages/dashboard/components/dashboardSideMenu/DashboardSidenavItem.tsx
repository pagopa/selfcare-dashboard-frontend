import { ListItemButton, ListItemText, ListItemIcon, Icon, ListItem } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

type Props = {
  handleClick: () => void;
  title: string;
  isSelected?: boolean;
  icon: SvgIconComponent;
};

export default function DashboardSidenavItem({ handleClick, title, isSelected, icon }: Props) {
  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={isSelected}
        onClick={handleClick}
        sx={{
          height: '100%',
          maxWidth: 360,
          backgroundColor: 'background.paper',
        }}
      >
        <ListItemIcon>
          <Icon component={icon} />
        </ListItemIcon>

        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
}
