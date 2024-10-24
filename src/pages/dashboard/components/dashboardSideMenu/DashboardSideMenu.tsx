import AssignmentIcon from '@mui/icons-material/Assignment';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import DnsIcon from '@mui/icons-material/Dns';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle';
import { Grid, List } from '@mui/material';
import {
  useErrorDispatcher,
  useLoading,
  usePermissions,
} from '@pagopa/selfcare-common-frontend/lib';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/lib/hooks/useUnloadEventInterceptor';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { Party } from '../../../../model/Party';
import { DASHBOARD_ROUTES } from '../../../../routes';
import { getBillingToken } from '../../../../services/tokenExchangeService';
import { LOADING_TASK_TOKEN_EXCHANGE_INVOICE } from '../../../../utils/constants';
import { ENV } from '../../../../utils/env';
import DashboardSidenavItem from './DashboardSidenavItem';

type Props = {
  party: Party;
  isAddDelegateSectionVisible?: boolean;
  isInvoiceSectionVisible: boolean;
  isHandleDelegationsVisible?: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hideLabels?: boolean;
};

export default function DashboardSideMenu({
  party,
  isAddDelegateSectionVisible,
  isInvoiceSectionVisible,
  isHandleDelegationsVisible,
  setDrawerOpen,
  hideLabels,
}: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const onExit = useUnloadEventOnExit();
  const [isInvoiceSelected, setIsInvoiceSelected] = useState(false);
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_TOKEN_EXCHANGE_INVOICE);

  const overviewRoute = DASHBOARD_ROUTES.OVERVIEW.path;
  const usersRoute = ENV.ROUTES.USERS;
  const groupsRoute = ENV.ROUTES.GROUPS;
  const delegatesRoute = DASHBOARD_ROUTES.DELEGATIONS.path;
  const ptRoute = DASHBOARD_ROUTES.TECHPARTNER.path;
  const { getAllProductsWithPermission } = usePermissions();

  const canSeeUsers = getAllProductsWithPermission(Actions.ListProductUsers).length > 0;
  const canSeeGroups = getAllProductsWithPermission(Actions.ManageProductGroups).length > 0;

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
  const lang = i18n.language;
  const getToken = async () => {
    setLoading(true);

    getBillingToken(party.partyId, undefined, lang)
      .then((result) => {
        window.location.assign(result);
      })
      .catch((error) => {
        addError({
          id: `TokenExchangeInvoiceError-${party.partyId}`,
          blocking: false,
          error,
          techDescription: `Something gone wrong retrieving token exchange on click of invoice button ${party.partyId}`,
          toNotify: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Grid container item mt={1} width="100%">
      <Grid item xs={12}>
        <List>
          <DashboardSidenavItem
            title={hideLabels ? '' : t('overview.sideMenu.institutionManagement.overview.title')}
            handleClick={() => {
              onExit(() => history.push(party.partyId ? overviewPath : overviewRoute));
              setDrawerOpen(false);
            }}
            isSelected={isOVerviewSelected}
            icon={ViewSidebarIcon}
            isHandleDelegationsVisible={isHandleDelegationsVisible}
            ptIcon={DnsIcon}
            ptTitle={hideLabels ? '' : t('overview.ptPage.title')}
            isPtSelected={isPtSelected}
            handleClickPtPage={() => onExit(() => history.push(party.partyId ? ptPath : ptRoute))}
            hideLabels={hideLabels}
          />
          {isAddDelegateSectionVisible && (
            <DashboardSidenavItem
              title={
                hideLabels ? '' : t('overview.sideMenu.institutionManagement.delegations.title')
              }
              handleClick={() => {
                onExit(() => history.push(party.partyId ? delegatesPath : delegatesRoute));
                setDrawerOpen(false);
              }}
              isSelected={isDelegateSelected}
              icon={AssignmentIcon}
              isHandleDelegationsVisible={false}
              hideLabels={hideLabels}
            />
          )}
          {canSeeUsers && (
            <DashboardSidenavItem
              title={hideLabels ? '' : t('overview.sideMenu.institutionManagement.referents.title')}
              handleClick={() => {
                onExit(() => history.push(party.partyId ? usersPath : usersRoute));
                setDrawerOpen(false);
              }}
              isSelected={isUserSelected}
              icon={PeopleAlt}
              isHandleDelegationsVisible={false}
              hideLabels={hideLabels}
            />
          )}
          {canSeeGroups && (
            <DashboardSidenavItem
              title={hideLabels ? '' : t('overview.sideMenu.institutionManagement.groups.title')}
              handleClick={() => {
                onExit(() => history.push(party.partyId ? groupsPath : groupsRoute));
                setDrawerOpen(false);
              }}
              isSelected={isGroupSelected}
              icon={SupervisedUserCircle}
              isHandleDelegationsVisible={false}
              hideLabels={hideLabels}
            />
          )}
          {isInvoiceSectionVisible && (
            <DashboardSidenavItem
              title={hideLabels ? '' : t('overview.sideMenu.institutionManagement.invoices.title')}
              // TODO add tokenExchange Call on click
              handleClick={() => {
                setIsInvoiceSelected(true);
                onExit(() => getToken());
              }}
              isSelected={isInvoiceSelected}
              icon={EuroSymbolIcon}
              isHandleDelegationsVisible={false}
              hideLabels={hideLabels}
            />
          )}
        </List>
      </Grid>
    </Grid>
  );
}
