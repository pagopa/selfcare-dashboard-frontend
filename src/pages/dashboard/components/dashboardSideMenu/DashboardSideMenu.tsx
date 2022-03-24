import React, { useEffect } from 'react';
import { List, Grid } from '@mui/material';
import { useHistory } from 'react-router';
import { History } from 'history';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { useTranslation } from 'react-i18next';
import { DASHBOARD_ROUTES } from '../../../../routes';
import { ENV } from '../../../../utils/env';
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
  onExit: (exitAction: () => void) => void,
  path: string,
  pathVariables?: { [key: string]: string }
) => {
  const resolvedPath = pathVariables ? resolvePathVariables(path, pathVariables) : path;
  return {
    onClick: () => onExit(() => history.push(resolvedPath)),
    isSelected: () => history.location.pathname === resolvedPath,
  };
};

export default function DashboardSideMenu({ products, party }: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const { invokeProductBo } = useTokenExchange();
  const onExit = useUnloadEventOnExit();

  const canSeeRoles = party.userRole === 'ADMIN';
  const canSeeGroups = party.userRole === 'ADMIN';
  const navigationMenu: Array<MenuItem> = [
    {
      groupId: 'selfCare',
      title: t('overview.sideMenu.institutionManagement.title'),
      active: true,
      subMenu: [
        {
          groupId: 'selfCare',
          title: t('overview.sideMenu.institutionManagement.overview.title'),
          active: true,
          ...applicationLinkBehaviour(history, onExit, DASHBOARD_ROUTES.OVERVIEW.path, {
            institutionId: party.institutionId,
          }),
        },
        canSeeRoles
          ? {
              groupId: 'selfCare',
              title: t('overview.sideMenu.institutionManagement.referents.title'),
              active: true,
              ...applicationLinkBehaviour(history, onExit, ENV.ROUTES.USERS, {
                institutionId: party.institutionId,
              }),
            }
          : undefined,
        canSeeGroups
          ? {
              groupId: 'selfCare',
              title: t('overview.sideMenu.institutionManagement.groups.title'),
              active: true,
              ...applicationLinkBehaviour(history, onExit, DASHBOARD_ROUTES.PARTY_GROUPS.path, {
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
      .filter((p) => p.status === 'ACTIVE')
      .map((p) => ({
        groupId: p.id,
        title: p.title,
        active: p.authorized ?? false,
        subMenu: [
          {
            groupId: p.id,
            title: t('overview.sideMenu.product.overview'),
            active: p.authorized ?? false,
            onClick: () => invokeProductBo(p, party),
          },
          p.userRole === 'ADMIN'
            ? {
                groupId: p.id,
                title: t('overview.sideMenu.product.referents'),
                active: p.authorized ?? false,
                ...applicationLinkBehaviour(history, onExit, ENV.ROUTES.PRODUCT_USERS, {
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
                color={!item.active ? '#CCD4DC' : 'primary.main'}
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
