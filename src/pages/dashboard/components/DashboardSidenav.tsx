import { ListItemButton, ListItemText, ListItemIcon, Box } from '@mui/material';
// import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
// import Home from '@mui/icons-material/Home';

// import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
// import PeopleAlt from '@mui/icons-material/PeopleAlt';
// import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle';
import { MenuItem } from './dashboardSideMenu/DashboardSideMenu';

type Props = {
  item?: MenuItem;
  selectedItem: MenuItem | null;
  handleClick: (_event: React.MouseEvent<HTMLDivElement, MouseEvent>, menuItem: any) => void;
};

export default function DashboardSidenav({ item, handleClick }: Props) {
  const isSelected = item?.isSelected && item?.isSelected();

  // const Icons = [
  //   {
  //     id: 1,
  //     item: 'Dashboard',
  //     description: 'icon',
  //     icon: DashboardCustomize,
  //   },
  //   {
  //     id: 2,
  //     name: 'PeopleAlt',
  //     description: 'icon',
  //     icon: PeopleAlt,
  //   },
  //   {
  //     id: 3,
  //     name: 'SupervisedUserCircle',
  //     description: 'icon',
  //     icon: SupervisedUserCircle,
  //   },
  // ];

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
