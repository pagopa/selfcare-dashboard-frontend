import { Box, Divider, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import { useTranslation, Trans } from 'react-i18next';
import { PartyUser, PartyUserProduct, PartyUserProductRole } from '../../../model/PartyUser';
import { deleteGroupRelation } from '../../../services/groupsService';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';
import { Party, UserStatus } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { PartyGroupExt } from '../../../model/PartyGroup';
import { updatePartyUserStatus } from '../../../services/usersService';
import { ProductRolesLists, transcodeProductRole2Title } from '../../../model/ProductRole';

type Props = {
  member: PartyUser;
  party: Party;
  product: Product;
  partyGroup: PartyGroupExt;
  userProduct: PartyUserProduct | undefined;
  isSuspended: boolean;
  productRolesLists: ProductRolesLists;
  onMemberStatusUpdate: (
    member: PartyUser,
    userProduct: PartyUserProduct,
    nextStatus: UserStatus
  ) => void;
  onMemberDelete: (member: PartyUser) => void;
  canEdit: boolean;
};
export default function GroupMenu({
  member,
  party,
  productRolesLists,
  product,
  partyGroup,
  userProduct,
  isSuspended,
  onMemberStatusUpdate,
  onMemberDelete,
  canEdit,
}: Props) {
  const ITEM_HEIGHT = 48;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();
  const { t } = useTranslation();

  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const role = userProduct?.roles[0];

  const confirmAction = () => {
    handleClose();
    addNotify({
      component: 'SessionModal',
      id: 'Notify_Example',
      title:
        role?.status === 'ACTIVE'
          ? t('groupMenu.confirmAction.titleSuspended')
          : t('groupMenu.confirmAction.titleActive'),
      message: (
        <>
          {role?.status === 'ACTIVE'
            ? t('groupMenu.confirmAction.messageSuspended')
            : t('groupMenu.confirmAction.messageActive')}
          <Trans i18nKey="groupMenu.confirmAction.message">
            <strong>
              {{
                transcodeProductRole2Title: transcodeProductRole2Title(
                  role?.role as string,
                  productRolesLists
                ),
              }}
            </strong>
            di
            <strong>{{ productTitle: product.title }}</strong>
            assegnato a
            <strong style={{ textTransform: 'capitalize' }}>
              {{ memberMame: `${party && member.name.toLocaleLowerCase()} ${member.surname}` }}
            </strong>
            .
            <br />
            Vuoi continuare?
          </Trans>
        </>
      ),
      confirmLabel: t('groupMenu.confirmAction.confirmLabel'),
      closeLabel: t('groupMenu.confirmAction.closeLabel'),
      onConfirm: confirmChangeStatus,
    });
  };

  const confirmChangeStatus = () => {
    const nextStatus: UserStatus | undefined =
      role?.status === 'ACTIVE' ? 'SUSPENDED' : role?.status === 'SUSPENDED' ? 'ACTIVE' : undefined;
    const selectedUserStatus =
      nextStatus === 'SUSPENDED'
        ? t('groupMenu.confirmChangeStatus.selectedUserStatusSuspended')
        : t('groupMenu.confirmChangeStatus.selectedUserStatusActive');
    const selectedUserStatusError =
      role?.status === 'SUSPENDED'
        ? t('groupMenu.confirmChangeStatus.selectedUserStatusErrorSuspended')
        : t('groupMenu.confirmChangeStatus.selectedUserStatusErrorActive');

    if (!nextStatus) {
      addError({
        id: 'INVALID_STATUS_TRANSITION',
        blocking: false,
        error: new Error('INVALID_STATUS_TRANSITION'),
        techDescription: `Invalid status transition while updating party (${party.institutionId}) user (${member.id}): ${member.status}`,
        toNotify: true,
      });

      return;
    }

    setLoading(true);
    updatePartyUserStatus(
      party,
      member,
      userProduct as PartyUserProduct,
      role as PartyUserProductRole,
      nextStatus
    )
      .then((_) => {
        onMemberStatusUpdate(member, userProduct as PartyUserProduct, nextStatus);
        addNotify({
          id: 'ACTION_ON_PARTY_USER_COMPLETED',
          title: t('groupMenu.confirmChangeStatus.updatePartyUserStatusThen.title', {
            selectedUserStatus: `${selectedUserStatus.toUpperCase()}`,
          }),
          message: (
            <>
              <Trans i18nKey="groupMenu.confirmChangeStatus.updatePartyUserStatusThen.message">
                Hai
                {{ selectedUserStatus }}
                correttamente
                <strong>{{ membersName: `${member.name} ${member.surname}` }}</strong>.
              </Trans>
            </>
          ),
          component: 'Toast',
        });
      })
      .catch((reason) =>
        addError({
          component: 'Toast',
          id: `UPDATE_PARTY_USER_ERROR-${member.id}`,
          displayableTitle: t(
            'groupMenu.confirmChangeStatus.updatePartyUserStatusCatch.displayableTitle',
            {
              selectedUserStatusError: `${selectedUserStatusError.toUpperCase()}`,
            }
          ),
          techDescription: `C'è stato un errore durante la ${selectedUserStatusError} dell'utente (${member.id}): ${member.status}`,
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: (
            <>
              <Trans i18nKey="groupMenu.confirmChangeStatus.updatePartyUserStatusCatch.displayableDescription">
                C&apos;è stato un errore durante la
                {{ selectedUserStatusError }}
                dell&apos;utente
                <strong>{{ memberName: `${member.name} ${member.surname}` }}</strong>.
              </Trans>
            </>
          ),
        })
      )
      .finally(() => setLoading(false));
  };

  const confirmDisociateAction = () => {
    handleClose();
    addNotify({
      component: 'SessionModal',
      id: 'Notify_Example',
      title: t('groupMenu.confirmDisociateAction.title'),
      message: (
        <>
          <Trans i18nKey="groupMenu.confirmDisociateAction.message">
            Stai per dissociare
            <strong>{{ memberName: member.name }}</strong>
            dal gruppo
            <strong>{{ groupName: partyGroup.name }}</strong>
            di
            <strong>{{ productTitle: product.title }}</strong>
            .
            <br />
            Vuoi continuare?
          </Trans>
        </>
      ),
      confirmLabel: t('groupMenu.confirmDisociateAction.confirmLabel'),
      closeLabel: t('groupMenu.confirmDisociateAction.closeLabel'),
      onConfirm: confirmUserDissociation,
    });
  };

  const confirmUserDissociation = () => {
    setLoading(true);
    deleteGroupRelation(party, product, partyGroup, member.id)
      .then((_) => {
        handleClose();
        onMemberDelete(member);
        addNotify({
          id: 'ACTION_ON_PARTY_USER_COMPLETED',
          title: t('groupMenu.confirmUserDissociation.deleteGroupRelationThen.title'),
          message: (
            <>
              <Trans i18nKey="groupMenu.confirmUserDissociation.deleteGroupRelationThen.message">
                Hai dissociato correttamente
                <strong>{{ memberName: `${member.name} ${member.surname} ` }}</strong>
                dal gruppo
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
          id: `DISSOCIATE_PARTY_USER_ERROR-${member.id}`,
          displayableTitle: t(
            'groupMenu.confirmUserDissociation.deleteGroupRelationCatch.displayableTitle'
          ),
          techDescription: `C'è stato un errore durante la dissociazione dell'utente (${member.id})`,
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: (
            <>
              <Trans i18nKey="groupMenu.confirmUserDissociation.deleteGroupRelationCatch.displayableDescription">
                C&apos;è stato un errore durante la dissociazione dell&apos;utente
                <strong>{{ memberName: `${member.name} ${member.surname}` }}</strong>.
              </Trans>
            </>
          ),
        })
      )
      .finally(() => setLoading(false));
  };
  return (
    <>
      {!member.isCurrentUser && canEdit && (
        <Grid item xs={1} display="flex" justifyContent="flex-end">
          <IconButton
            sx={{ p: '0px', ':hover': { backgroundColor: 'transparent' } }}
            disableRipple
            onClick={handleClick}
            disabled={isSuspended}
          >
            <MoreVertIcon sx={{ color: isSuspended ? '#a2adb8' : 'primary' }} />
          </IconButton>
        </Grid>
      )}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
            padding: '8px 0',
          },
        }}
      >
        <Box width="100%" display="flex" justifyContent="center">
          <MenuItem onClick={confirmDisociateAction}>
            {t('groupMenu.dissociateMenuItem.label')}
          </MenuItem>
        </Box>
        {userProduct?.roles.length === 1 && !member.isCurrentUser && (
          <Box key={userProduct.id}>
            <Box width="170px" margin="4px auto">
              <Divider />
            </Box>
            <Box width="100%" display="flex" justifyContent="center">
              <MenuItem onClick={confirmAction}>
                {role?.status === 'ACTIVE'
                  ? t('groupMenu.suspendMenuItem.suspendLabel')
                  : role?.status === 'SUSPENDED'
                  ? t('groupMenu.suspendMenuItem.activeLabel')
                  : ''}
              </MenuItem>
            </Box>
          </Box>
        )}
      </Menu>
    </>
  );
}
