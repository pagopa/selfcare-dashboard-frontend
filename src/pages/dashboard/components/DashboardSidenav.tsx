import React from 'react';

import { List, ListItemButton, ListItemText, ListItemIcon, Box } from '@mui/material';

/* Icons */
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle';
// import { useHistory } from 'react-router-dom';
// import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';

export default function DashboardSidenav() {
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  //   const history = useHistory();

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Box
      sx={{
        height: '100%',
        maxWidth: 360,
        backgroundColor: 'background.paper',
      }}
    >
      <List component="nav" aria-label="main piattaforma-notifiche sender">
        {/* Panoramica */}
        <ListItemButton>
          <ListItemIcon>
            <DashboardCustomize fontSize="inherit" />
          </ListItemIcon>
          <ListItemText primary="Panoramica" />
        </ListItemButton>
        {/* Utenti */}
        <ListItemButton selected={selectedIndex === 1} onClick={() => handleListItemClick(1)}>
          <ListItemIcon>
            <PeopleAlt fontSize="inherit" />
          </ListItemIcon>
          <ListItemText primary="Utenti" />
        </ListItemButton>
        {/* Gruppi */}
        <ListItemButton selected={selectedIndex === 2} onClick={() => handleListItemClick(2)}>
          <ListItemIcon>
            <SupervisedUserCircle fontSize="inherit" />
          </ListItemIcon>
          <ListItemText primary="Gruppi" />
        </ListItemButton>
      </List>
    </Box>
  );
}
