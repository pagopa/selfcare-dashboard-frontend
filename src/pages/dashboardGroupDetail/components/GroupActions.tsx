import { Button, Grid } from '@mui/material';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { deletePartyGroup, updatePartyGroupStatus } from '../../../services/groupsService';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';
import { PartyGroupExt, PartyGroupStatus } from '../../../model/PartyGroup';
import { Party } from '../../../model/Party';
import { Product, ProductsMap } from '../../../model/Product';
import { DASHBOARD_ROUTES } from '../../../routes';

type Props = {
  partyGroup: PartyGroupExt;
  isSuspended: boolean;
  goBack: () => void;
  party: Party;
  product: Product;
  productsMap: ProductsMap;
  fetchPartyGroup: () => void;
  onGroupStatusUpdate: (nextGroupStatus: PartyGroupStatus) => void;
  nextGroupStatus: PartyGroupStatus | undefined;
  canEdit: boolean;
};
export default function GroupActions({
  partyGroup,
  isSuspended,
  goBack,
  party,
  product,
  productsMap,
  onGroupStatusUpdate,
  nextGroupStatus,
  canEdit,
}: Props) {
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);
  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();
  const history = useHistory();
  const { t } = useTranslation();

  const selectedGroupStatus =
    nextGroupStatus === 'SUSPENDED'
      ? t('groupActions.selectedGroupStatusSuspended')
      : t('groupActions.selectedGroupStatusActive');
  const selectedGroupStatusError =
    partyGroup.status === 'SUSPENDED'
      ? t('groupActions.selectedGroupStatusErrorSuspended')
      : t('groupActions.selectedGroupStatusErrorActive');

  const goEdit = () =>
    history.push(
      resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.PARTY_GROUP_EDIT.path, {
        institutionId: partyGroup.institutionId,
        groupId: partyGroup.id,
      })
    );

  const goToDuplicate = () =>
    history.push(
      resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.PARTY_GROUP_CLONE.path, {
        institutionId: partyGroup.institutionId,
        groupId: partyGroup.id,
      })
    );

  const handleOpenDelete = () => {
    addNotify({
      component: 'SessionModal',
      id: 'Notify_Example',
      title: t('groupActions.handleOpenDelete.addNotify.title'),
      message: (
        <>
          <Trans i18nKey="groupActions.handleOpenDelete.addNotify.message">
            Stai per eliminare il gruppo
            <strong>{{ groupName: partyGroup.name }}</strong>
            .
            <br />
            Vuoi continuare?
          </Trans>
        </>
      ),
      confirmLabel: t('groupActions.handleOpenDelete.addNotify.confirmLabel'),
      closeLabel: t('groupActions.handleOpenDelete.addNotify.closeLabel'),
      onConfirm: onDelete,
    });
  };

  const onDelete = () => {
    setLoading(true);
    deletePartyGroup(party, product, partyGroup)
      .then((_) => {
        goBack();
        addNotify({
          component: 'Toast',
          id: 'DELETE_PARTY_USER',
          title: 'GRUPPO ELIMINATO',
          message: (
            <>
              <Trans i18nKey="groupActions.onDelete.toastComponentThen.message">
                Hai eliminato correttamente il gruppo
                <strong>{{ groupName: partyGroup.name }}</strong>.
              </Trans>
            </>
          ),
        });
      })
      .catch((reason) =>
        addError({
          component: 'Toast',
          id: `DELETE_PARTY_GROUP_ERROR-${partyGroup.id}`,
          displayableTitle: t('groupActions.onDelete.toastComponentCatch.displayableTitle'),
          techDescription: `C'è stato un errore durante l'eliminazione del gruppo ${partyGroup.name}`,
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: (
            <>
              <Trans i18nKey="groupActions.onDelete.toastComponentCatch.displayableDescription">
                C&apos;è stato un errore durante l&apos;eliminazione del gruppo
                <strong>{{ groupName: partyGroup.name }}</strong>.
              </Trans>
            </>
          ),
        })
      )
      .finally(() => setLoading(false));
  };

  const handleOpen = () => {
    addNotify({
      component: 'SessionModal',
      id: 'Notify_Example',
      title:
        partyGroup.status === 'ACTIVE'
          ? t('groupActions.handleOpen.addNotify.titleActive')
          : t('groupActions.handleOpen.addNotify.titleSuspended'),
      message: (
        <>
          {partyGroup.status === 'ACTIVE'
            ? t('groupActions.handleOpen.addNotify.messageActive')
            : t('groupActions.handleOpen.addNotify.messageSuspended')}
          <Trans i18nKey="groupActions.handleOpen.addNotify.messageGroup">
            <strong>{{ groupName: partyGroup.name }}</strong>
            di
            <strong>{{ productTitle: productsMap[partyGroup.productId].title }}</strong>
            .
            <br />
            Vuoi continuare?
          </Trans>
        </>
      ),
      confirmLabel: t('groupActions.handleOpen.addNotify.confirmLabel'),
      closeLabel: t('groupActions.handleOpen.addNotify.closeLabel'),
      onConfirm: confirmChangeStatus,
    });
  };

  const confirmChangeStatus = () => {
    if (!nextGroupStatus) {
      addError({
        id: 'INVALID_STATUS_TRANSITION',
        blocking: false,
        error: new Error('INVALID_STATUS_TRANSITION'),
        techDescription: `Invalid status transition while updating group (${partyGroup.id})`,
        toNotify: true,
      });
      return;
    }
    setLoading(true);
    updatePartyGroupStatus(party, product, partyGroup, nextGroupStatus)
      .then((_) => {
        onGroupStatusUpdate(nextGroupStatus);
        addNotify({
          id: 'ACTION_ON_PARTY_GROUP_COMPLETED',
          title: t('groupActions.confirmChangeStatus.updatePartyGroupStatusThen.title', {
            selectedGroupStatus: `${selectedGroupStatus.toUpperCase()}`,
          }),
          message: (
            <>
              <Trans i18nKey="groupActions.confirmChangeStatus.updatePartyGroupStatusThen.message">
                Hai
                {{ selectedGroupStatus }}
                correttamente il gruppo
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
            'groupActions.confirmChangeStatus.updatePartyGroupStatusCatch.displayableTitle',
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
              <Trans i18nKey="groupActions.confirmChangeStatus.updatePartyGroupStatusCatch.displayableDescription">
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

  return (
    <Grid container spacing={4}>
      {!isSuspended && canEdit && (
        <Grid item xs={3}>
          <Button variant="contained" sx={{ height: '40px', width: '100%' }} onClick={goEdit}>
            {t('groupActions.editActionLabel')}
          </Button>
        </Grid>
      )}
      {canEdit && (
        <Grid item xs={3}>
          <Button variant="contained" sx={{ height: '40px', width: '100%' }} onClick={handleOpen}>
            {partyGroup.status === 'SUSPENDED'
              ? t('groupActions.groupActionActive')
              : partyGroup.status === 'ACTIVE'
              ? t('groupActions.groupActionSuspend')
              : ''}
          </Button>
        </Grid>
      )}
      {!isSuspended && (
        <Grid item xs={3}>
          <Button
            variant="contained"
            sx={{ height: '40px', width: '100%' }}
            onClick={goToDuplicate}
          >
            {t('groupActions.groupDuplicateAction')}
          </Button>
        </Grid>
      )}
      {canEdit && (
        <Grid item xs={3}>
          <Button
            variant="outlined"
            color="error"
            sx={{ height: '40px', width: '100%' }}
            onClick={handleOpenDelete}
          >
            {t('groupActions.groupDeleteAction')}
          </Button>
        </Grid>
      )}
    </Grid>
  );
}
