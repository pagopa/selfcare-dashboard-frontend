import { useTheme } from '@mui/material';
import { useErrorDispatcher } from '@pagopa/selfcare-common-frontend';
import {
  resetPermissions,
  setProductPermissions,
} from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import RemoteRoutingAdmin from '../../microcomponents/admin/RemoteRoutingAdmin';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  resetAdminProductRoles,
  selectAdminRolesNeedsReload,
  selectAdminRolesStatus,
  setAdminProductRoles,
  setAdminRolesStatus,
} from '../../redux/slices/adminRolesSlice';
import { getPermissionsAdminService } from '../../services/adminService';
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

  const dispatch = useAppDispatch();
  const addError = useErrorDispatcher();
  const status = useAppSelector(selectAdminRolesStatus);
  const needsReload = useAppSelector(selectAdminRolesNeedsReload);
  const permissions = useAppSelector((s: any) => s.permissions?.items ?? []);

  useEffect(() => {
    // only fetch when explicitly reloading or when we don't have permissions yet
    const shouldFetch = needsReload || (status !== 'succeeded' && permissions.length === 0);
    if (status === 'pending' || !shouldFetch) {
      return;
    }

    // avoid wiping existing permissions unless a reload was requested
    if (needsReload) {
      dispatch(resetPermissions());
      dispatch(resetAdminProductRoles());
    }
    dispatch(setAdminRolesStatus('pending'));

    getPermissionsAdminService()
      .then((res) => {
        const payload = (res.items || []).map((p) => ({
          productId: p.productId ?? '',
          actions: [...(p.permissions ?? [])],
        }));
        dispatch(setProductPermissions(payload));

        const rolesPayload = (res.items || []).map((i) => ({
          productId: i.productId ?? '',
          role: i.role ?? '',
        }));
        dispatch(setAdminProductRoles(rolesPayload));
      })
      .catch((error) => {
        dispatch(setAdminRolesStatus('failed'));
        addError({
          id: 'getPermissionsList-api-error',
          blocking: false,
          techDescription: 'Get permissions list failed',
          toNotify: false,
          error: error as Error,
        });
      });
  }, [needsReload, status, permissions]);

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
