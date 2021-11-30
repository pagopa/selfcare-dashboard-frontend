import React from 'react';
import { List, Grid } from '@mui/material';
import { useLocation, matchPath } from 'react-router-dom';
import ROUTES from '../../../../routes';
import { Product } from '../../../../model/Product';
import { Party } from '../../../../model/Party';
import { useTokenExchange } from '../../../../hooks/useTokenExchange';
import DashboardSideMenuItem, { MenuItem } from './DashboardSideMenuItem';

type Props = {
  products: Array<Product>;
  party: Party;
};

export default function DashboardSideMenu({ products, party }: Props) {
  const location = useLocation();
  const { invokeProductBo } = useTokenExchange();

  const canSeeRoles = party.platformRole === 'ADMIN_REF' || party.platformRole === 'ADMIN';
  const navigationMenu: Array<MenuItem> = [
    {
      groupId: 'selfCare',
      title: 'Gestione ente',
      active: true,
      isSelected: () => true,
      subMenu: [
        {
          groupId: 'selfCare',
          title: 'Overview',
          active: true,

          isSelected: (location) =>
            matchPath(location.pathname, ROUTES.PARTY_DASHBOARD.path) !== null,
        },
        canSeeRoles ? { groupId: 'selfCare', title: 'Ruoli', active: true } : undefined,
      ],
    },
  ];
  const [selectedItem, setSelectedItem] = React.useState<MenuItem | null>(navigationMenu[0]);
  const arrayMenu: Array<MenuItem> = navigationMenu.concat(
    products
      .filter((p) => p.active)
      .map((p) => ({
        groupId: p.id,
        title: p.title,
        active: p.authorized ?? false,
        subMenu: [
          {
            groupId: p.id,
            title: 'Overview',
            active: p.authorized ?? false,
            onClick: () => invokeProductBo(p, party),
          },
          canSeeRoles
            ? { groupId: p.id, title: 'Ruoli', active: p.authorized ?? false }
            : undefined,
        ],
      }))
  );

  const handleClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    menuItem: MenuItem
  ) => {
    setSelectedItem(
      menuItem.groupId === selectedItem?.groupId && menuItem.subMenu ? null : menuItem
    );
    if (menuItem.onClick) {
      menuItem.onClick();
    }
  };

  return (
    <Grid container item mt={11}>
      <Grid item xs={12}>
        <List>
          {arrayMenu &&
            arrayMenu.map((item) => (
              <DashboardSideMenuItem
                key={item.title}
                item={item}
                selectedItem={selectedItem}
                handleClick={handleClick}
                location={location}
              />
            ))}
        </List>
      </Grid>
    </Grid>
  );
}
