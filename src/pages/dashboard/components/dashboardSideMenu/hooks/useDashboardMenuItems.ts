import { SvgIconComponent } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import DnsIcon from '@mui/icons-material/Dns';
import EuroSymbolIcon from '@mui/icons-material/EuroSymbol';
import PeopleAlt from '@mui/icons-material/PeopleAlt';
import SupervisedUserCircle from '@mui/icons-material/SupervisedUserCircle';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import {
  useErrorDispatcher,
  useLoading,
  usePermissions,
} from '@pagopa/selfcare-common-frontend/lib';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend/lib/hooks/useUnloadEventInterceptor';
import i18n from '@pagopa/selfcare-common-frontend/lib/locale/locale-utils';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Party } from '../../../../../model/Party';
import { useAppDispatch } from '../../../../../redux/hooks';
import { partiesActions } from '../../../../../redux/slices/partiesSlice';
import { DASHBOARD_ROUTES } from '../../../../../routes';
import { getBillingToken } from '../../../../../services/tokenExchangeService';
import { LOADING_TASK_TOKEN_EXCHANGE_INVOICE } from '../../../../../utils/constants';
import { ENV } from '../../../../../utils/env';

export type MenuItem = {
  key: string;
  title: string;
  icon: SvgIconComponent;
  path: string;
  isVisible: boolean;
  isSelected: boolean;
  action: () => void;
};

type Params = {
  party?: Party;
  isAddDelegateSectionVisible: boolean;
  isInvoiceSectionVisible: boolean;
  isHandleDelegationsVisible: boolean;
  isDocumentsSectionVisible: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useDashboardMenuItems({
  party,
  isAddDelegateSectionVisible,
  isInvoiceSectionVisible,
  isHandleDelegationsVisible,
  isDocumentsSectionVisible,
  setDrawerOpen,
}: Params): Array<MenuItem> {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const onExit = useUnloadEventOnExit();
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_TOKEN_EXCHANGE_INVOICE);
  const { getAllProductsWithPermission } = usePermissions();
  const dispatch = useAppDispatch();

  const canSeeUsers =
    getAllProductsWithPermission(
      isPagoPaUser() ? Actions.ListAllProductUsers : Actions.ListProductUsers
    ).length > 0;

  const canSeeGroups =
    getAllProductsWithPermission(Actions.ListProductGroups).length > 0 ||
    getAllProductsWithPermission(Actions.ListAllProductGroups).length > 0;

  const canSeeDocuments = getAllProductsWithPermission(Actions.ViewContract).length > 0;
  const isPagoPaOverviewVisible = !location.pathname.includes('admin');

  const resolvePath = useCallback(
    (path: string, institutionId?: string) =>
      resolvePathVariables(path, { partyId: party?.partyId || institutionId || '' }),
    [party]
  );

  const navigateTo = useCallback(
    (path: string) => {
      onExit(() => {
        history.push(path);
        setDrawerOpen(false);
      });
    },
    [onExit, history, setDrawerOpen]
  );

  const handleInvoiceClick = useCallback(() => {
    const lang = i18n.language;
    setLoading(true);
    getBillingToken(party?.partyId || '', undefined, lang)
      .then((result) => window.location.assign(result))
      .catch((error) => {
        addError({
          id: `TokenExchangeInvoiceError-${party?.partyId}`,
          blocking: false,
          error,
          techDescription: `Something gone wrong retrieving token exchange on click of invoice button ${party?.partyId}`,
          toNotify: true,
        });
      })
      .finally(() => setLoading(false));
  }, [party, setLoading, addError]);

  const spidUserFlow: Array<MenuItem> = [
    {
      key: 'techpartner',
      title: t('overview.ptPage.title'),
      icon: DnsIcon,
      path: resolvePath(DASHBOARD_ROUTES.TECHPARTNER.path),
      isVisible: isHandleDelegationsVisible,
      isSelected: location.pathname === resolvePath(DASHBOARD_ROUTES.TECHPARTNER.path),
      action: () => navigateTo(resolvePath(DASHBOARD_ROUTES.TECHPARTNER.path)),
    },
    {
      key: 'overview',
      title: t('overview.sideMenu.institutionManagement.overview.title'),
      icon: ViewSidebarIcon,
      path: resolvePath(DASHBOARD_ROUTES.OVERVIEW.path),
      isVisible: true,
      isSelected: location.pathname === resolvePath(DASHBOARD_ROUTES.OVERVIEW.path),
      action: () => navigateTo(resolvePath(DASHBOARD_ROUTES.OVERVIEW.path)),
    },
    {
      key: 'delegations',
      title: t('overview.sideMenu.institutionManagement.delegations.title'),
      icon: AssignmentIcon,
      path: resolvePath(DASHBOARD_ROUTES.DELEGATIONS.path),
      isVisible: isAddDelegateSectionVisible,
      isSelected: location.pathname === resolvePath(DASHBOARD_ROUTES.DELEGATIONS.path),
      action: () => navigateTo(resolvePath(DASHBOARD_ROUTES.DELEGATIONS.path)),
    },
    {
      key: 'documents',
      title: t('overview.sideMenu.institutionManagement.documents.title'),
      icon: ArticleIcon,
      path: resolvePath(DASHBOARD_ROUTES.DOCUMENTS.path),
      isVisible: isDocumentsSectionVisible,
      isSelected: location.pathname === resolvePath(DASHBOARD_ROUTES.DOCUMENTS.path),
      action: () => {
        trackEvent('DASHBOARD_OPEN_DOCUMENT', { party_id: party?.partyId });
        navigateTo(resolvePath(DASHBOARD_ROUTES.DOCUMENTS.path));
      },
    },
    {
      key: 'users',
      title: t('overview.sideMenu.institutionManagement.referents.title'),
      icon: PeopleAlt,
      path: resolvePath(ENV.ROUTES.USERS),
      isVisible: canSeeUsers,
      isSelected: location.pathname.startsWith(resolvePath(ENV.ROUTES.USERS)),
      action: () => navigateTo(resolvePath(ENV.ROUTES.USERS)),
    },
    {
      key: 'groups',
      title: t('overview.sideMenu.institutionManagement.groups.title'),
      icon: SupervisedUserCircle,
      path: resolvePath(ENV.ROUTES.GROUPS),
      isVisible: canSeeGroups,
      isSelected: location.pathname.startsWith(resolvePath(ENV.ROUTES.GROUPS)),
      action: () => navigateTo(resolvePath(ENV.ROUTES.GROUPS)),
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

  const pagoPaAdminFlow: Array<MenuItem> = [
    {
      key: 'adminPage',
      title: t('overview.sideMenu.institutionManagement.adminPage.title'),
      icon: DashboardOutlinedIcon,
      path: ENV.ROUTES.ADMIN_SEARCH,
      isVisible: true,
      isSelected: location.pathname === ENV.ROUTES.ADMIN_SEARCH,
      action: () => {
        dispatch(partiesActions.setPartySelected(undefined));
        navigateTo(ENV.ROUTES.ADMIN_SEARCH);
      },
    },
    {
      key: 'onboardings',
      title: t('overview.sideMenu.institutionManagement.onboardings.title'),
      icon: DnsOutlinedIcon,
      path: ENV.ROUTES.ADMIN_INSTITUTION_ONBOARDINGS,
      isVisible: true,
      isSelected: location.pathname.startsWith(ENV.ROUTES.ADMIN_INSTITUTION_ONBOARDINGS),
      action: () => {
        navigateTo(ENV.ROUTES.ADMIN_INSTITUTION_ONBOARDINGS);
      },
    },
    {
      key: 'overview',
      title: t('overview.sideMenu.institutionManagement.overview.title'),
      icon: ViewSidebarIcon,
      path: resolvePath(DASHBOARD_ROUTES.OVERVIEW.path, 'onboarded'),
      isVisible: isPagoPaOverviewVisible,
      isSelected: location.pathname === resolvePath(DASHBOARD_ROUTES.OVERVIEW.path),
      action: () => navigateTo(resolvePath(DASHBOARD_ROUTES.OVERVIEW.path)),
    },
    {
      key: 'documents',
      title: t('overview.sideMenu.institutionManagement.documents.title'),
      icon: ArticleIcon,
      path: resolvePath(DASHBOARD_ROUTES.DOCUMENTS.path),
      isVisible: ENV.SHOW_DOCUMENTS && canSeeDocuments && isPagoPaOverviewVisible,
      isSelected: location.pathname === resolvePath(DASHBOARD_ROUTES.DOCUMENTS.path),
      action: () => {
        trackEvent('DASHBOARD_OPEN_DOCUMENT', { party_id: party?.partyId });
        navigateTo(resolvePath(DASHBOARD_ROUTES.DOCUMENTS.path));
      },
    },
    {
      key: 'users',
      title: t('overview.sideMenu.institutionManagement.referents.title'),
      icon: PeopleAlt,
      path: resolvePath(ENV.ROUTES.USERS),
      isVisible: canSeeUsers && isPagoPaOverviewVisible,
      isSelected: location.pathname.startsWith(resolvePath(ENV.ROUTES.USERS)),
      action: () => navigateTo(resolvePath(ENV.ROUTES.USERS)),
    },
    {
      key: 'groups',
      title: t('overview.sideMenu.institutionManagement.groups.title'),
      icon: SupervisedUserCircle,
      path: resolvePath(ENV.ROUTES.GROUPS),
      isVisible: canSeeGroups && isPagoPaOverviewVisible,
      isSelected: location.pathname.startsWith(resolvePath(ENV.ROUTES.GROUPS)),
      action: () => navigateTo(resolvePath(ENV.ROUTES.GROUPS)),
    },
  ];

  const allItems = isPagoPaUser() ? pagoPaAdminFlow : spidUserFlow;
  return allItems.filter((item) => item.isVisible);
}
