import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { useTranslation, Trans } from 'react-i18next';
import { Party, UserStatus } from '../../../../../model/Party';
import { LOADING_TASK_ACTION_ON_PARTY_GROUP } from '../../../../../utils/constants';
import { PartyGroup, PartyGroupStatus } from '../../../../../model/PartyGroup';
import { Product } from '../../../../../model/Product';
import { deletePartyGroup, updatePartyGroupStatus } from '../../../../../services/groupsService';
import { DASHBOARD_ROUTES } from '../../../../../routes';

type Props = {
  party: Party;
  partyGroup: PartyGroup;
  product: Product;
  onDelete: (partyGroup: PartyGroup) => void;
  onStatusUpdate: (partyGroup: PartyGroup, nextStatus: PartyGroupStatus) => void;
};

const ITEM_HEIGHT = 48;

export default function GroupProductRowActions({
  party,
  partyGroup,
  product,
  onDelete,
  onStatusUpdate,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const history = useHistory();
  const { t } = useTranslation();

  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();

  const setLoading = useLoading(LOADING_TASK_ACTION_ON_PARTY_GROUP);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const askConfirm = (title: string, actionMessage: string, onConfirm: () => void) => {
    addNotify({
      id: `CONFIRM_ACTION_${title}_ON_${partyGroup.id}`,
      title,
      message: (
        <>
          <Trans i18nKey="dashboardGroup.groupProductRowActions.askConfirm.message">
            {{ message: actionMessage }}
            il gruppo
            <strong>{{ groupName: partyGroup.name }}</strong>
            di
            <strong>{{ productTitle: product.title }}</strong>
            .
            <br />
            Vuoi continuare?
          </Trans>
        </>
      ),
      onConfirm,
      confirmLabel: t('dashboardGroup.groupProductRowActions.askConfirm.confirmLabel'),
    });
  };

  const performAction = (
    action: () => Promise<void>,
    title: string,
    actionMessage: string,
    onComplete: () => void
  ) => {
    const selectedGroupStatusError =
      partyGroup.status === 'SUSPENDED'
        ? t(
            'dashboardGroup.groupProductRowActions.performAction.updatePartyGroupStatusCatch.selectedGroupStatusErrorSuspended'
          )
        : t(
            'dashboardGroup.groupProductRowActions.performAction.updatePartyGroupStatusCatch.selectedGroupStatusErrorActive'
          );

    setLoading(true);
    action()
      .then((_) => {
        onComplete();
        addNotify({
          id: 'ACTION_ON_PARTY_GROUP_COMPLETED',
          title,
          message: (
            <>
              <Trans i18nKey="dashboardGroup.groupProductRowActions.performAction.updatePartyGroupStatusThen.message">
                {{ message: actionMessage }}
                il gruppo
                <strong>{{ groupName: partyGroup.name }}</strong>.
              </Trans>
            </>
          ),
          component: 'Toast',
        });
      })
      .catch((reason) =>
        addError({
          component: 'Toast',
          id: `'UPDATE_PARTY_GROUP_ERROR-${partyGroup.id}`,
          displayableTitle: t(
            'dashboardGroup.groupProductRowActions.performAction.updatePartyGroupStatusCatch.displayableTitle',
            {
              selectedGroupStatusError: `${selectedGroupStatusError.toUpperCase()}`,
            }
          ),
          techDescription: `C'è stato un errore durante la ${selectedGroupStatusError} del gruppo (${partyGroup.name}) con id (${partyGroup.id}): ${partyGroup.status}`,
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: (
            <>
              <Trans i18nKey="dashboardGroup.groupProductRowActions.performAction.updatePartyGroupStatusCatch.displayableDescription">
                C&apos;è stato un errore durante la
                {{ selectedGroupStatusError }}
                del gruppo
                <strong>{{ groupName: partyGroup.name }}</strong>.
              </Trans>
            </>
          ),
        })
      )
      .finally(() => setLoading(false));
  };

  const handleChangeState = () => {
    handleClose();

    const nextStatus: UserStatus | undefined =
      partyGroup.status === 'ACTIVE'
        ? 'SUSPENDED'
        : partyGroup.status === 'SUSPENDED'
        ? 'ACTIVE'
        : undefined;
    if (!nextStatus) {
      addError({
        id: 'INVALID_STATUS_TRANSITION',
        blocking: false,
        error: new Error('INVALID_STATUS_TRANSITION'),
        techDescription: `Invalid status transition while updating party (${party.institutionId}) group (${partyGroup.id}): ${partyGroup.status}`,
        toNotify: true,
      });

      return;
    }

    askConfirm(
      nextStatus === 'SUSPENDED'
        ? t('dashboardGroup.groupProductRowActions.handleChangeState.askConfirmSuspend')
        : t('dashboardGroup.groupProductRowActions.handleChangeState.askConfirmActive'),
      nextStatus === 'SUSPENDED'
        ? t('dashboardGroup.groupProductRowActions.handleChangeState.askConfirmBeforeSuspend')
        : t('dashboardGroup.groupProductRowActions.handleChangeState.askConfirmBeforeActive'),
      () => updateStatus(nextStatus)
    );
  };

  const updateStatus = (nextStatus: PartyGroupStatus) => {
    const selectedUserStatus =
      nextStatus === 'SUSPENDED'
        ? t('dashboardGroup.groupProductRowActions.updateStatus.nextStatusSuspended')
        : t('dashboardGroup.groupProductRowActions.updateStatus.nextStatusActive');
    performAction(
      () => updatePartyGroupStatus(party, product, partyGroup, nextStatus),
      t('dashboardGroup.groupProductRowActions.updateStatus.performActionTitle', {
        selectedUserStatus: `${selectedUserStatus.toUpperCase()}`,
      }),
      t('dashboardGroup.groupProductRowActions.updateStatus.performActionActionMessage', {
        selectedUserStatus: `${selectedUserStatus}`,
      }),
      () => onStatusUpdate(partyGroup, nextStatus)
    );
  };

  const handleDelete = () => {
    handleClose();
    askConfirm(
      t('dashboardGroup.groupProductRowActions.handleDelete.askConfirmDeleted'),
      t('dashboardGroup.groupProductRowActions.handleDelete.askConfirmBeforeDeleted'),
      deleteGroup
    );
  };

  const deleteGroup = () => {
    performAction(
      () => deletePartyGroup(party, product, partyGroup),
      t('dashboardGroup.groupProductRowActions.deleteGroup.performActionTitle'),
      t('dashboardGroup.groupProductRowActions.deleteGroup.performActionMessage'),
      () => onDelete(partyGroup)
    );
  };

  const handleModify = () => {
    handleClose();
    history.push(
      resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.PARTY_GROUP_EDIT.path, {
        institutionId: party.institutionId,
        groupId: partyGroup.id,
      })
    );
  };

  const handleClone = () => {
    handleClose();
    history.push(
      resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.PARTY_GROUP_CLONE.path, {
        institutionId: party.institutionId,
        groupId: partyGroup.id,
      })
    );
  };

  const isSuspended = partyGroup.status === 'SUSPENDED';
  const isActive = partyGroup.status === 'ACTIVE';

  return (
    <div style={{ textAlign: 'right' }}>
      <IconButton onClick={handleClick}>
        <MoreVertIcon color="primary" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {!isSuspended && (
          <MenuItem onClick={handleModify}>
            {t('dashboardGroup.groupProductRowActions.modifyActionLink')}
          </MenuItem>
        )}
        {!isSuspended && (
          <MenuItem onClick={handleClone}>
            {t('dashboardGroup.groupProductRowActions.duplicateActionLink')}
          </MenuItem>
        )}
        {(isActive || isSuspended) && (
          <MenuItem onClick={handleChangeState}>
            {isActive
              ? t('dashboardGroup.groupProductRowActions.suspendActionLink')
              : isSuspended
              ? t('dashboardGroup.groupProductRowActions.activateActionLink')
              : ''}
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete}>Elimina</MenuItem>
      </Menu>
    </div>
  );
}
