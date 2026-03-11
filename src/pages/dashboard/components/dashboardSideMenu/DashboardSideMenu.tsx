import { SvgIconComponent } from '@mui/icons-material';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
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
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { isPagoPaUser } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { Party } from '../../../../model/Party';
import { useAppDispatch } from '../../../../redux/hooks';
import { partiesActions } from '../../../../redux/slices/partiesSlice';
import { DASHBOARD_ROUTES } from '../../../../routes';
import { getBillingToken } from '../../../../services/tokenExchangeService';
import { LOADING_TASK_TOKEN_EXCHANGE_INVOICE } from '../../../../utils/constants';
import { ENV } from '../../../../utils/env';
import DashboardSideNavItem from './DashboardSidenavItem';
import { useDashboardMenuItems } from './hooks/useDashboardMenuItems';

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
  party?: Party;
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
  isDocumentsSectionVisible = false,
  setDrawerOpen,
  hideLabels = false,
}: Readonly<Props>) {
  const location = useLocation();
  const isPagoPaOverviewVisible = !location.pathname.includes('admin');

  const visibleMenuItems = useDashboardMenuItems({
    party,
    isAddDelegateSectionVisible,
    isInvoiceSectionVisible,
    isHandleDelegationsVisible,
    isDocumentsSectionVisible,
    setDrawerOpen,
  });

  return (
    <Grid container item mt={1} width="100%">
      <Grid item xs={12}>
        <List>
          {visibleMenuItems.map((item) => (
            <Box key={item.key}>
              <DashboardSideNavItem
                title={hideLabels ? '' : item.title}
                icon={item.icon}
                handleClick={item.action}
                isSelected={item.isSelected}
                hideLabels={hideLabels}
                itemKey={item.key}
              />
              {(item.key === 'techpartner' ||
                (isPagoPaOverviewVisible && item.key === 'adminPage')) && (
                <Divider sx={{ mt: 2, mb: 2 }} />
              )}
            </Box>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}
