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

const arrayMenu: Array<MenuItem> = [
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
  // { title: 'App IO', active: true }, // TODO read from input products
  // { title: 'Piattaforma Notifiche', active: false }, // TODO read from input products
];

export default function DashboardSideMenu({ products }: Props) {
  // const arrayConcat = arrayMenu
  //   .concat(products.filter((product) => product.active === true))
  //   .map((item) => {
  //     console.log('ITEM', item);
  //   });

  // console.log('ARRAY CONCAT', arrayConcat);

  const [selectedItem, setSelectedItem] = React.useState<MenuItem | null>(arrayMenu[0]);
  const location = useLocation();

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
            arrayMenu.concat(products.filter((product) => product.active === true)).map((item) => {
              console.log("ITEM",item);
              const isOpened = selectedItem === item;
              return (
                <React.Fragment key={item.title} >
                  <ListItem
                    disableRipple
                    button
                    sx={{
                      color: '#0073E6',
                      marginBottom:'8px',
                      backgroundColor: 'transparent !important',
                    }}

                    // disabled
                    selected={item.isSelected && item.isSelected(location)}
                    onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                      handleClick(event, item)
                    }
                  >
                    <Grid container>
                      <Grid item xs={10}>
                        <Typography variant="h6" sx={{ fontSize: '18px' }}>
                          {item.title}
                        </Typography>
                      </Grid>
                      {item.subMenu && (
                        <Grid item xs={2}>
                          {isOpened ? (
                            <ExpandLess sx={{ color: '#0073E6' }} />
                          ) : (
                            <ExpandMore sx={{ color: '#0073E6' }} />
                          )}
                        </Grid>
                      )}
                    </Grid>
                  </ListItem>
                  {item.subMenu && (
                    <Collapse in={isOpened} timeout="auto" unmountOnExit>
                      <List sx={{ pl: 4, top:'-15px' }}>
                        <ListItem button sx={{ color: '#0073E6' }}>
                          <Typography variant="body2">Overview</Typography>
                        </ListItem>
                        <ListItem button sx={{ color: '#0073E6' }}>
                          <Typography variant="body2">Ruoli</Typography>
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
