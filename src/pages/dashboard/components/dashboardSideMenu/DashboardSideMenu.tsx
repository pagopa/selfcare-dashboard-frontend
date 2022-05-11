import { List, Grid } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { useHistory } from 'react-router';
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
import DashboardSidenavItem from './DashboardSidenavItem';

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

export default function DashboardSideMenu({ party }: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const onExit = useUnloadEventOnExit();

  const canSeeRoles = party.userRole === 'ADMIN';
  const canSeeGroups = party.userRole === 'ADMIN';

  const isOVerviewSelected =
    window.location.pathname ===
    resolvePathVariables(DASHBOARD_ROUTES.OVERVIEW.path, {
      partyId: party.partyId,
    });
  const isRoleSelected = window.location.pathname.startsWith(
    resolvePathVariables(ENV.ROUTES.USERS, {
      partyId: party.partyId,
    })
  );
  const isGroupSelected = window.location.pathname.startsWith(
    resolvePathVariables(ENV.ROUTES.GROUPS, {
      partyId: party.partyId,
    })
  );

  return (
    <Grid container item mt={11}>
      <Grid item xs={12}>
        <List>
          <DashboardSidenavItem
            title={t('overview.sideMenu.institutionManagement.overview.title')}
            handleClick={() =>
              onExit(() =>
                history.push(
                  party.partyId
                    ? resolvePathVariables(DASHBOARD_ROUTES.OVERVIEW.path, {
                        partyId: party.partyId,
                      })
                    : DASHBOARD_ROUTES.OVERVIEW.path
                )
              )
            }
            isSelected={isOVerviewSelected}
            icon={DashboardCustomize}
          />
          {canSeeRoles && (
            <DashboardSidenavItem
              title={t('overview.sideMenu.institutionManagement.referents.title')}
              handleClick={() =>
                onExit(() =>
                  history.push(
                    party.partyId
                      ? resolvePathVariables(ENV.ROUTES.USERS, {
                          partyId: party.partyId,
                        })
                      : ENV.ROUTES.USERS
                  )
                )
              }
              isSelected={isRoleSelected}
              icon={PeopleAlt}
            />
          )}
          {canSeeGroups && (
            <DashboardSidenavItem
              title={t('overview.sideMenu.institutionManagement.groups.title')}
              handleClick={() =>
                onExit(() =>
                  history.push(
                    party.partyId
                      ? resolvePathVariables(ENV.ROUTES.GROUPS, {
                          partyId: party.partyId,
                        })
                      : ENV.ROUTES.GROUPS
                  )
                )
              }
              isSelected={isGroupSelected}
              icon={SupervisedUserCircle}
            />
          )}
        </List>
      </Grid>
    </Grid>
  );
}
