import React, { useEffect } from 'react';
import { List, Grid } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { useHistory } from 'react-router';
import { History } from 'history';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { useTranslation } from 'react-i18next';
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle';
import { DASHBOARD_ROUTES } from '../../../../routes';
import { ENV } from '../../../../utils/env';
import { Product } from '../../../../model/Product';
import { Party } from '../../../../model/Party';
import DashboardSidenav from './../DashboardSidenav';

type Props = {
  products: Array<Product>;
  party: Party;
};

export type MenuItem = {
  groupId: string;
  subMenu?: Array<MenuItem | undefined>;
  onClick?: () => void;
  title: string;
  active: boolean;
  isSelected?: () => boolean;
  icon: SvgIconComponent;
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

export default function DashboardSideMenu({ party }: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const onExit = useUnloadEventOnExit();

  // const canSeeRoles = party.userRole === 'ADMIN';
  // const canSeeGroups = party.userRole === 'ADMIN';

  const sideNavItem: Array<MenuItem> = [
    {
      groupId: 'selfCare',
      title: t('overview.sideMenu.institutionManagement.overview.title'),
      active: true,
      ...applicationLinkBehaviour(history, onExit, DASHBOARD_ROUTES.OVERVIEW.path, {
        partyId: party.partyId,
      }),
      icon: DashboardCustomize,
    },
    {
      groupId: 'selfCare',
      title: t('overview.sideMenu.institutionManagement.referents.title'),
      active: true,
      ...applicationLinkBehaviour(history, onExit, ENV.ROUTES.USERS, {
        partyId: party.partyId,
      }),
      icon: PeopleAlt,
    },
    {
      groupId: 'selfCare',
      title: t('overview.sideMenu.institutionManagement.groups.title'),
      active: true,
      ...applicationLinkBehaviour(history, onExit, ENV.ROUTES.GROUPS, {
        partyId: party.partyId,
      }),
      icon: SupervisedUserCircle,
    },
  ];

  const [selectedItem, setSelectedItem] = React.useState<MenuItem | null>(sideNavItem[0]);

  useEffect(
    () =>
      setSelectedItem(
        sideNavItem.find(
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
          {sideNavItem &&
            sideNavItem.map((item) => (
              <DashboardSidenav
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
