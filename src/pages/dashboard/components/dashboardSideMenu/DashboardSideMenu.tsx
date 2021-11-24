import React from 'react';
import { List, ListItem, Grid } from '@mui/material';
import { Typography } from '@mui/material';
import { ExpandLess } from '@mui/icons-material';
import { ExpandMore } from '@mui/icons-material';
import Collapse from '@mui/material/Collapse';
import { useLocation, matchPath } from 'react-router-dom';
import { Location } from 'history';
import ROUTES from '../../../../routes';
import { Product } from '../../../../model/Product';
import { URL_FE_LOGIN } from '../../../../utils/constants';

type Props = {
  products: Array<Product>;
};

type MenuItem = {
  title: string;
  subMenu?: Array<MenuItem>;
  onClick?: () => void;
  active: boolean;
  isSelected?: (location: Location) => boolean;
};

const navigationMenu: Array<MenuItem> = [
  {
    title: 'Gestione ente',
    active: true,
    isSelected: () => true,
    subMenu: [
      {
        title: 'Overview',
        active: true,
        isSelected: (location) => !matchPath(location.pathname, ROUTES.PARTY_DASHBOARD.path),
      },
      { title: 'Ruoli', active: true },
    ],
  },
];

export default function DashboardSideMenu({ products }: Props) {
  const [selectedItem, setSelectedItem] = React.useState<MenuItem | null>(navigationMenu[0]);
  const location = useLocation();

  const arrayMenu: Array<MenuItem> = navigationMenu.concat(
    products
      .filter((p) => p.active)
      .map((p) => ({
        title: p.title,
        active: p.authorized ?? false,
        onClick: p.urlBO ? () => window.location.assign(p.urlBO ?? '') : undefined,
      }))
  );

  const handleClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    menuItem: MenuItem
  ) => {
    setSelectedItem(menuItem === selectedItem ? null : menuItem);
    if (menuItem.onClick) {
      menuItem.onClick();
      window.location.assign(URL_FE_LOGIN);
    }
  };

  return (
    <Grid container item mt={11}>
      <Grid item xs={12}>
        <List>
          {arrayMenu &&
            arrayMenu.map((item) => {
              const isOpened = selectedItem === item;
              return (
                <React.Fragment key={item.title}>
                  <ListItem
                    disableRipple
                    button
                    sx={{
                      color: 'primary.main',
                      marginBottom: '8px',
                      backgroundColor: 'transparent !important',
                    }}
                    disabled={!item.active}
                    selected={item.isSelected && item.isSelected(location)}
                    onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                      handleClick(event, item)
                    }
                  >
                    <Grid container>
                      <Grid item xs={10}>
                        <Typography variant="h6" sx={{ fontSize: '18px', color: 'primary.main' }}>
                          {item.title}
                        </Typography>
                      </Grid>
                      {item.subMenu && (
                        <Grid item xs={2}>
                          {isOpened ? (
                            <ExpandLess sx={{ color: 'primary.main' }} />
                          ) : (
                            <ExpandMore sx={{ color: 'primary.main' }} />
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </ListItem>
                  {item.subMenu && (
                    <Collapse in={isOpened} timeout="auto" unmountOnExit>
                      <List sx={{ pl: 4, top: '-15px' }}>
                        <ListItem button sx={{ color: 'primary.main' }}>
                          <Typography variant="body2" color="primary.main">
                            Overview
                          </Typography>
                        </ListItem>
                        <ListItem button sx={{ color: 'primary.main' }}>
                          <Typography variant="body2" color="primary.main">
                            Ruoli
                          </Typography>
                        </ListItem>
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
        </List>
      </Grid>
    </Grid>
  );
}
