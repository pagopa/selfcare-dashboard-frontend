import { useTheme } from '@mui/material';
import { Route, Switch, useHistory, useLocation, matchPath } from 'react-router-dom';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import {
  resetPermissions,
  setProductPermissions,
} from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import RemoteRoutingAdmin from '../../microcomponents/admin/RemoteRoutingAdmin';
import { useAppDispatch } from '../../redux/hooks';
import { getPermissionsAdminService } from '../../services/adminService';
import { ENV } from '../../utils/env';
import DashboardShell from '../dashboard/DashboardShell';
import { setAdminProductRoles, resetAdminProductRoles } from '../../redux/slices/adminRolesSlice';

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

  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();
  const location = useLocation();

  useEffect(() => {
    const isAdminSection = !!matchPath(location.pathname, {
      path: ENV.ROUTES.ADMIN,
      exact: false,
    });
    const isPartyDetail = !!matchPath(location.pathname, {
      path: ENV.ROUTES.ADMIN_PARTY_DETAIL,
      exact: false,
    });

    if (!isAdminSection || isPartyDetail) {
      return;
    }

    dispatch(resetPermissions());
    dispatch(resetAdminProductRoles());

    getPermissionsAdminService()
      .then((res) => {
        const payload = (res.items || []).map((p) => ({
          productId: p.productId ?? '',
          actions: [...(p.permissions ?? [])],
        }));
        dispatch(setProductPermissions(payload));

        // collect roles from service items and store them for the admin microfrontend
        const rolesPayload = (res.items || []).map((i) => ({
          productId: i.productId ?? '',
          role: i.role ?? '',
        }));
        dispatch(setAdminProductRoles(rolesPayload));
      })
      .catch((error) => {
        addError({
          id: 'getPermissionsList-api-error',
          blocking: false,
          techDescription: 'Get permissions list failed',
          toNotify: false,
          error: error as Error,
        });
      });
  }, [location.pathname, dispatch, addError]);

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

export default DashboardAdminPage;
