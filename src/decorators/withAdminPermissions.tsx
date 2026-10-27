import useErrorDispatcher from '@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher';
import {
  resetPermissions,
  setProductPermissions,
} from '@pagopa/selfcare-common-frontend/lib/redux/slices/permissionsSlice';
import { Dispatch } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { useStore } from 'react-redux';
import { useAppDispatch } from '../redux/hooks';
import {
  resetAdminProductRoles,
  selectAdminRolesStatus,
  setAdminProductRoles,
  setAdminRolesStatus,
} from '../redux/slices/adminRolesSlice';
import { getPermissionsAdminService } from '../services/adminService';

/**
 * Replaces the product permissions with the PagoPA admin ones.
 * Party pages (host overview, remote party detail) overwrite the shared permissions, so the
 * admin permissions are reloaded every time the admin area is entered.
 */
export const loadAdminPermissions = (dispatch: Dispatch, getState: () => any): Promise<void> => {
  if (selectAdminRolesStatus(getState()) === 'pending') {
    return Promise.resolve();
  }

  dispatch(resetPermissions());
  dispatch(resetAdminProductRoles());
  dispatch(setAdminRolesStatus('pending'));

  return getPermissionsAdminService()
    .then((res) => {
      const items = res.items ?? [];
      dispatch(
        setProductPermissions(
          items.map((p) => ({ productId: p.productId ?? '', actions: [...(p.permissions ?? [])] }))
        )
      );
      dispatch(
        setAdminProductRoles(
          items.map((i) => ({ productId: i.productId ?? '', role: i.role ?? '' }))
        )
      );
    })
    .catch((error) => {
      dispatch(setAdminRolesStatus('failed'));
      throw error;
    });
};

export default function withAdminPermissions<T>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithAdminPermissions = (props: T) => {
    const dispatch = useAppDispatch();
    const store = useStore();
    const addError = useErrorDispatcher();

    useEffect(() => {
      loadAdminPermissions(dispatch, store.getState).catch((error: Error) =>
        addError({
          id: 'getPermissionsList-api-error',
          blocking: false,
          techDescription: 'Get permissions list failed',
          toNotify: false,
          error,
        })
      );
    }, []);

    return <WrappedComponent {...(props as any)} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithAdminPermissions.displayName = `withAdminPermissions(${displayName})`;

  return ComponentWithAdminPermissions;
}
