import React from 'react';
import { Grid } from '@mui/material';
import { List, ListItem } from '@mui/material';
import { Typography } from '@mui/material';
import { ExpandLess } from '@mui/icons-material';
import { ExpandMore } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';

export default function DashboardSideMenu() {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <Grid container>
      <Grid item mt={'91px'} ml={'84px'} xs={12}>
        <List >
          <ListItem
            button
            sx={{ color: '#0073E6' }}
            // disabled
            // selected={selectedIndex === 0}
            onClick={handleClick}
          >
            <Grid container>
              <Grid item xs={10}>
                <Typography variant="h6" sx={{ fontSize: '18px' }}>
                  Gestione ente
                </Typography>
              </Grid>
              <Grid item xs={2}>
                {open ? (
                  <ExpandLess sx={{ color: '#0073E6' }} />
                ) : (
                  <ExpandMore sx={{ color: '#0073E6' }} />
                )}
              </Grid>
            </Grid>
          </ListItem>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List sx={{ pl: 4 }}>
              <ListItem button sx={{color: '#0073E6'}}>
                <Typography variant="body2">
                Overview
                </Typography>
              </ListItem>
              <ListItem button sx={{color: '#0073E6'}}>
                <Typography variant="body2" >
                Ruoli
                </Typography>
              </ListItem>
            </List>
          </Collapse>

          <ListItem
            button
            sx={{ color: '#0073E6' }}
            // disabled
            // selected={selectedIndex === 0}
            onClick={handleClick}
          >
            <Grid container>
              <Grid item xs={10}>
                <Typography variant="h6" sx={{ fontSize: '18px' }}>
                App IO
                </Typography>
              </Grid>
            </Grid>
          </ListItem>

          <ListItem
            button
            sx={{ color: '#0073E6' }}
            disabled
            // selected={selectedIndex === 0}
            onClick={handleClick}
          >
            <Grid container>
              <Grid item xs={10}>
                <Typography variant="h6" sx={{ fontSize: '18px' }}>
                Piattaforma Notifiche
                </Typography>
              </Grid>
            </Grid>
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
}
