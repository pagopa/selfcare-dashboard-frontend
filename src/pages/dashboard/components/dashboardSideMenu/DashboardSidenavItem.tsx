import { ListItemButton, ListItemText, ListItemIcon, Box, Icon } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

type Props = {
  handleClick: () => void;
  title: string;
  isSelected?: boolean;
  icon: SvgIconComponent;
};

export default function DashboardSidenavItem({ handleClick, title, isSelected, icon }: Props) {
  return (
    <Box
      sx={{
        height: '100%',
        maxWidth: 360,
        backgroundColor: 'background.paper',
      }}
    >
      <ListItemButton selected={isSelected} onClick={handleClick}>
        <ListItemIcon>
          <Icon component={icon} />
        </ListItemIcon>

        <ListItemText primary={title} />
      </ListItemButton>
    </Box>
  );
}
