import { ListItemButton, ListItemText, ListItemIcon, Box } from '@mui/material';
import { MenuItem } from './dashboardSideMenu/DashboardSideMenu';

type Props = {
  item?: MenuItem;
  selectedItem: MenuItem | null;
  handleClick: (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, menuItem: any) => void;
};

export default function DashboardSidenav({ item, handleClick }: Props) {
  const isSelected = item?.isSelected && item?.isSelected();

  return (
    <Box
      sx={{
        height: '100%',
        maxWidth: 360,
        backgroundColor: 'background.paper',
      }}
    >
      <ListItemButton
        selected={isSelected}
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleClick(event, item)}
      >
        <ListItemIcon>{item && <item.icon />}</ListItemIcon>

        <ListItemText primary={item?.title} />
      </ListItemButton>
    </Box>
  );
}
