import React, { useEffect } from 'react';
import { List, Grid } from '@mui/material';
import { matchPath } from 'react-router-dom';
import { useHistory } from 'react-router';
import { History } from 'history';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { DASHBOARD_ROUTES, RouteConfig } from '../../../../routes';
import { Product } from '../../../../model/Product';
import { Party } from '../../../../model/Party';
import { useTokenExchange } from '../../../../hooks/useTokenExchange';
import DashboardSideMenuItem, { MenuItem } from './DashboardSideMenuItem';

type Props = {
  products: Array<Product>;
  party: Party;
};

const applicationLinkBehaviour = (
  history: History,
  route: RouteConfig,
  pathVariables?: { [key: string]: string }
) => ({
  onClick: () =>
    history.push(pathVariables ? resolvePathVariables(route.path, pathVariables) : route.path),
  isSelected: () => matchPath(history.location.pathname, route) !== null,
});

export default function DashboardSideMenu({ products, party }: Props) {
  const history = useHistory();
  const { invokeProductBo } = useTokenExchange();

  const canSeeRoles = party.userRole === 'ADMIN';
  const navigationMenu: Array<MenuItem> = [
    {
      groupId: 'selfCare',
      title: 'Gestione Ente',
      active: true,
      subMenu: [
        {
          groupId: 'selfCare',
          title: 'Panoramica',
          active: true,
          ...applicationLinkBehaviour(history, DASHBOARD_ROUTES.OVERVIEW, {
            institutionId: party.institutionId,
          }),
        },
        canSeeRoles
          ? {
              groupId: 'selfCare',
              title: 'Referenti',
              active: true,
              ...applicationLinkBehaviour(history, DASHBOARD_ROUTES.PARTY_USERS, {
                institutionId: party.institutionId,
              }),
            }
          : undefined,
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
            title: 'Panoramica',
            active: p.authorized ?? false,
            onClick: () => invokeProductBo(p, party),
          },
          p.userRole === 'ADMIN'
            ? {
                groupId: p.id,
                title: 'Referenti',
                active: p.authorized ?? false,
                ...applicationLinkBehaviour(history, DASHBOARD_ROUTES.PARTY_PRODUCT_USERS, {
                  institutionId: party.institutionId,
                  productId: p.id,
                }),
              }
            : undefined,
        ],
      }))
  );

  useEffect(
    () =>
      setSelectedItem(
        arrayMenu.find(
          (m) => m.isSelected || (m.subMenu && m.subMenu.findIndex((m) => m?.isSelected) > -1)
        ) ?? null
      ),
    []
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
              />
            ))}
        </List>
      </Grid>
    </Grid>
  );
}
