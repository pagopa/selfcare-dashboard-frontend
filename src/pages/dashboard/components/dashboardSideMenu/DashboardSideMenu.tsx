import { List, Grid } from '@mui/material';
import { useHistory } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import { useTranslation } from 'react-i18next';
import DashboardCustomize from '@mui/icons-material/DashboardCustomize';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DnsIcon from '@mui/icons-material/Dns';
import { DASHBOARD_ROUTES } from '../../../../routes';
import { ENV } from '../../../../utils/env';
import { Party } from '../../../../model/Party';
import DashboardSidenavItem from './DashboardSidenavItem';

type Props = {
  party: Party;
  isDelegateSectionVisible?: boolean;
  canSeeSection: boolean;
};

export default function DashboardSideMenu({
  party,
  isDelegateSectionVisible,
  canSeeSection,
}: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const onExit = useUnloadEventOnExit();

  const overviewRoute = DASHBOARD_ROUTES.OVERVIEW.path;
  const usersRoute = ENV.ROUTES.USERS;
  const groupsRoute = ENV.ROUTES.GROUPS;
  const delegatesRoute = DASHBOARD_ROUTES.DELEGATIONS.path;
  const ptRoute = DASHBOARD_ROUTES.TECHPARTNER.path;

  const overviewPath = resolvePathVariables(overviewRoute, {
    partyId: party.partyId ?? '',
  });
  const usersPath = resolvePathVariables(usersRoute, {
    partyId: party.partyId ?? '',
  });
  const groupsPath = resolvePathVariables(groupsRoute, {
    partyId: party.partyId ?? '',
  });
  const delegatesPath = resolvePathVariables(delegatesRoute, {
    partyId: party.partyId,
  });
  const ptPath = resolvePathVariables(ptRoute, {
    partyId: party.partyId,
  });

  const isOVerviewSelected = window.location.pathname === overviewPath;
  const isUserSelected = window.location.pathname.startsWith(usersPath);
  const isDelegateSelected = window.location.pathname.startsWith(delegatesPath);
  const isGroupSelected = window.location.pathname.startsWith(groupsPath);
  const isPtSelected = window.location.pathname.startsWith(ptPath);

  return (
    <Grid container item mt={1} width="100%">
      <Grid item xs={12}>
        <List sx={{ width: '100%' }}>
          <DashboardSidenavItem
            title={t('overview.sideMenu.institutionManagement.overview.title')}
            handleClick={() =>
              onExit(() => history.push(party.partyId ? overviewPath : overviewRoute))
            }
            isSelected={isOVerviewSelected}
            isSubMenuSelected={isDelegateSelected}
            icon={DashboardCustomize}
            subMenuVisible={!!isDelegateSectionVisible}
            subMenuIcon={AssignmentIcon}
            subMenuTitle={t('overview.sideMenu.institutionManagement.overview.subMenu.title')}
            handleClickSubMenu={() =>
              onExit(() => history.push(party.partyId ? delegatesPath : delegatesRoute))
            }
            isPtPageVisible={party?.institutionType === 'PT'}
            ptIcon={DnsIcon}
            ptTitle={t('overview.ptPage.title')}
            isPtSelected={isPtSelected}
            handleClickPtPage={() => onExit(() => history.push(party.partyId ? ptPath : ptRoute))}
          />
          {canSeeSection && (
            <DashboardSidenavItem
              title={t('overview.sideMenu.institutionManagement.referents.title')}
              handleClick={() => onExit(() => history.push(party.partyId ? usersPath : usersRoute))}
              isSelected={isUserSelected}
              icon={PeopleAlt}
              subMenuVisible={false}
              isPtPageVisible={false}
            />
          )}
          {canSeeSection && (
            <DashboardSidenavItem
              title={t('overview.sideMenu.institutionManagement.groups.title')}
              handleClick={() =>
                onExit(() => history.push(party.partyId ? groupsPath : groupsRoute))
              }
              isSelected={isGroupSelected}
              icon={SupervisedUserCircle}
              subMenuVisible={false}
              isPtPageVisible={false}
            />
          )}
        </List>
      </Grid>
    </Grid>
  );
}
