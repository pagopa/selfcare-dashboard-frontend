import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import withAdminPermissions from '../../decorators/withAdminPermissions';
import RemoteRoutingAdmin from '../../microcomponents/admin/RemoteRoutingAdmin';
import { ENV } from '../../utils/env';
import DashboardShell from '../dashboard/DashboardShell';

/**
 * DashboardAdminPage - Dashboard for PagoPA authenticated users
 * This component handles users who login via Google (iss: 'pagopa')
 * Unlike regular users, PagoPA users don't have a partyId and only access Admin features
 */
const DashboardAdminPage: React.FC = () => {
  const theme = useTheme();
  const store = useStore();
  const { i18n } = useTranslation();
  const history = useHistory();

  return (
    <DashboardShell
      isAddDelegateSectionVisible={false}
      isInvoiceSectionVisible={false}
      isHandleDelegationsVisible={false}
      isDocumentsSectionVisible={false}
    >
      <Switch>
        <Route path={ENV.ROUTES.ADMIN} exact={false}>
          <RemoteRoutingAdmin history={history} store={store} theme={theme} i18n={i18n} />
        </Route>
      </Switch>
    </DashboardShell>
  );
};

export default withAdminPermissions(DashboardAdminPage);
