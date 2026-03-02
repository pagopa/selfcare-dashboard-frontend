import { Grid, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import RemoteRoutingAdmin from '../../microcomponents/admin/RemoteRoutingAdmin';
import { ENV } from '../../utils/env';
import DashboardSideMenuDesktop from '../dashboard/components/dashboardSideMenu/DashboardSideMenuDesktop';
import DashboardSideMenuMobile from '../dashboard/components/dashboardSideMenu/DashboardSideMenuMobile';

/**
 * DashboardAdminPage - Dashboard for PagoPA authenticated users
 * This component handles users who login via Google (iss: 'pagopa')
 * Unlike regular users, PagoPA users don't have a partyId and only access Admin features
 */
const DashboardAdminPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const store = useStore();
  const { i18n } = useTranslation();
  const history = useHistory();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hideLabels, setHideLabels] = useState(false);

  return (
    <Grid
      container
      item
      xs={12}
      sx={{
        backgroundColor: 'background.paper',
        justifyContent: 'flex-start',
      }}
    >
      {isMobile ? (
        <DashboardSideMenuMobile
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          hideLabels={hideLabels}
          isAddDelegateSectionVisible={false}
          isInvoiceSectionVisible={false}
          isHandleDelegationsVisible={false}
          isDocumentsSectionVisible={false}
          currentPathname={location.pathname}
        />
      ) : (
        <DashboardSideMenuDesktop
          hideLabels={hideLabels}
          setHideLabels={setHideLabels}
          setDrawerOpen={setDrawerOpen}
          isAddDelegateSectionVisible={false}
          isInvoiceSectionVisible={false}
          isHandleDelegationsVisible={false}
          isDocumentsSectionVisible={false}
        />
      )}

      <Grid
        item
        component="main"
        sx={{ backgroundColor: 'background.default' }}
        display="flex"
        minHeight="100vh"
        justifyContent="flex-start"
        flexDirection="column"
        alignItems="flex-start"
        pb={8}
        xs={12}
        lg={hideLabels ? 11 : 10}
      >
        <Switch>
          <Route path={[ENV.ROUTES.ADMIN_SEARCH, ENV.ROUTES.ADMIN_CONTRACT]} exact={false}>
            {<RemoteRoutingAdmin history={history} store={store} theme={theme} i18n={i18n} />}
          </Route>
        </Switch>
      </Grid>
    </Grid>
  );
};

export default DashboardAdminPage;
