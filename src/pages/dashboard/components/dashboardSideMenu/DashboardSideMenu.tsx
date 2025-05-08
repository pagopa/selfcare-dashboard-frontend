import { SvgIconComponent } from '@mui/icons-material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DnsIcon from '@mui/icons-material/Dns';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import { Box, Divider, Grid, List } from '@mui/material';
import {
  useErrorDispatcher,
  useLoading,
  usePermissions,
} from '@pagopa/selfcare-common-frontend/lib';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/lib/hooks/useUnloadEventInterceptor';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { Party } from '../../../../model/Party';
import { DASHBOARD_ROUTES } from '../../../../routes';
import { getBillingToken } from '../../../../services/tokenExchangeService';
import { LOADING_TASK_TOKEN_EXCHANGE_INVOICE } from '../../../../utils/constants';
import { ENV } from '../../../../utils/env';
import DashboardSideNavItem from './DashboardSidenavItem';

type MenuItem = {
  key: string;
  title: string;
  icon: SvgIconComponent;
  path: string;
  isVisible: boolean;
  isSelected: boolean;
  action?: () => void;
};

type Props = {
  party: Party;
  isAddDelegateSectionVisible?: boolean;
  isInvoiceSectionVisible: boolean;
  isHandleDelegationsVisible?: boolean;
  isDocumentsSectionVisible?: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hideLabels?: boolean;
};

export default function DashboardSideMenu({
  party,
  isAddDelegateSectionVisible = false,
  isInvoiceSectionVisible = false,
  isHandleDelegationsVisible = false,
  isDocumentsSectionVisible = true,
  setDrawerOpen,
  hideLabels = false,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const onExit = useUnloadEventOnExit();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_TOKEN_EXCHANGE_INVOICE);
  const { getAllProductsWithPermission } = usePermissions();

  const canSeeUsers = getAllProductsWithPermission(Actions.ListProductUsers).length > 0;
  const canSeeGroups = getAllProductsWithPermission(Actions.ManageProductGroups).length > 0;

  // Helper to resolve paths with party ID
  const resolvePath = useCallback(
    (path: string) => resolvePathVariables(path, { partyId: party.partyId ?? '' }),
    [party.partyId]
  );

  // Handle navigation with unload event
  const navigateTo = useCallback(
    (path: string) => {
      onExit(() => {
        history.push(path);
        setDrawerOpen(false);
      });
    },
    [onExit, history, setDrawerOpen]
  );

  // Handle invoice token exchange
  const handleInvoiceClick = useCallback(() => {
    const lang = i18n.language;
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
  }, [party.partyId, setLoading, addError]);

  const menuItems: Array<MenuItem> = [
    {
      key: 'techpartner',
      title: t('overview.ptPage.title'),
      icon: DnsIcon,
      path: resolvePath(DASHBOARD_ROUTES.TECHPARTNER.path),
      isVisible: isHandleDelegationsVisible,
      isSelected: location.pathname === resolvePath(DASHBOARD_ROUTES.TECHPARTNER.path),
    },
    {
      key: 'overview',
      title: t('overview.sideMenu.institutionManagement.overview.title'),
      icon: ViewSidebarIcon,
      path: resolvePath(DASHBOARD_ROUTES.OVERVIEW.path),
      isVisible: true,
      isSelected: location.pathname === resolvePath(DASHBOARD_ROUTES.OVERVIEW.path),
    },
    {
      key: 'delegations',
      title: t('overview.sideMenu.institutionManagement.delegations.title'),
      icon: AssignmentIcon,
      path: resolvePath(DASHBOARD_ROUTES.DELEGATIONS.path),
      isVisible: isAddDelegateSectionVisible,
      isSelected: location.pathname === resolvePath(DASHBOARD_ROUTES.DELEGATIONS.path),
    },
    {
      key: 'documents',
      title: t('overview.sideMenu.institutionManagement.documents.title'),
      icon: AssignmentIcon,
      path: resolvePath(DASHBOARD_ROUTES.DOCUMENTS.path),
      isVisible: isDocumentsSectionVisible,
      isSelected: location.pathname === resolvePath(DASHBOARD_ROUTES.DOCUMENTS.path),
    },
    {
      key: 'users',
      title: t('overview.sideMenu.institutionManagement.referents.title'),
      icon: PeopleAlt,
      path: resolvePath(ENV.ROUTES.USERS),
      isVisible: canSeeUsers,
      isSelected: location.pathname.startsWith(resolvePath(ENV.ROUTES.USERS)),
    },
    {
      key: 'groups',
      title: t('overview.sideMenu.institutionManagement.groups.title'),
      icon: SupervisedUserCircle,
      path: resolvePath(ENV.ROUTES.GROUPS),
      isVisible: canSeeGroups,
      isSelected: location.pathname.startsWith(resolvePath(ENV.ROUTES.GROUPS)),
    },
    {
      key: 'invoices',
      title: t('overview.sideMenu.institutionManagement.invoices.title'),
      icon: EuroSymbolIcon,
      path: '#',
      isVisible: isInvoiceSectionVisible,
      isSelected: false,
      action: () => onExit(() => handleInvoiceClick()),
    },
  ];

  return (
    <Grid container item mt={1} width="100%">
      <Grid item xs={12}>
        <List>
          {menuItems.map((item) => {
            if (!item.isVisible) {
              return null;
            }

            return (
              <Box key={item.key} mb={item.key === 'techpartner' ? 2 : 0}>
                <DashboardSideNavItem
                  title={hideLabels ? '' : item.title}
                  icon={item.icon}
                  handleClick={item.action || (() => navigateTo(item.path))}
                  isSelected={item.isSelected}
                  hideLabels={hideLabels}
                />

                {item.key === 'techpartner' && <Divider />}
              </Box>
            );
          })}
        </List>
      </Grid>
    </Grid>
  );
}
