import { Box, Divider, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
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
}: Props) {
  const ITEM_HEIGHT = 48;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();

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
      title: role?.status === 'ACTIVE' ? 'Sospendi Ruolo' : 'Riabilita Ruolo',
      message: (
        <>
          {role?.status === 'ACTIVE'
            ? 'Stai per sospendere il ruolo '
            : 'Stai per riabilitare il ruolo '}
          <strong>{transcodeProductRole2Title(role?.role as string, productRolesLists)}</strong>
          {' di '}
          <strong> {product.title} </strong>
          {' assegnato a '}
          <strong style={{ textTransform: 'capitalize' }}>
            {party && `${member.name.toLocaleLowerCase()} ${member.surname}`}
          </strong>
          {'.'}
          <br />
          {'Vuoi continuare?'}
        </>
      ),
      confirmLabel: 'Conferma',
      closeLabel: 'Annulla',
      onConfirm: confirmChangeStatus,
    });
  };

  const confirmChangeStatus = () => {
    const nextStatus: UserStatus | undefined =
      role?.status === 'ACTIVE' ? 'SUSPENDED' : role?.status === 'SUSPENDED' ? 'ACTIVE' : undefined;
    const selectedUserStatus = nextStatus === 'SUSPENDED' ? 'sospeso' : 'riabilitato';
    const selectedUserStatusError = role?.status === 'SUSPENDED' ? 'sospensione' : 'riabilitazione';

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
          title: `REFERENTE ${selectedUserStatus.toUpperCase()}`,
          message: (
            <>
              {`Hai ${selectedUserStatus} correttamente `}
              <strong>{`${member.name} ${member.surname}`}</strong>
              {'.'}
            </>
          ),
          component: 'Toast',
        });
      })
      .catch((reason) =>
        addError({
          component: 'Toast',
          id: `UPDATE_PARTY_USER_ERROR-${member.id}`,
          displayableTitle: `ERRORE DURANTE LA ${selectedUserStatusError.toUpperCase()} DELL'UTENTE `,
          techDescription: `C'è stato un errore durante la ${selectedUserStatusError} dell'utente (${member.id}): ${member.status}`,
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: `C'è stato un errore durante la ${selectedUserStatusError} dell'utente (${member.id}): ${member.status}`,
        })
      )
      .finally(() => setLoading(false));
  };

  const confirmDisociateAction = () => {
    handleClose();
    addNotify({
      component: 'SessionModal',
      id: 'Notify_Example',
      title: 'Dissocia',
      message: (
        <>
          {'Stai per dissociare '}
          <strong>{member.name}</strong>
          {' dal gruppo '}
          <strong>{partyGroup.name}</strong>
          {' di '}
          <strong> {product.title} </strong>
          {'.'}
          <br />
          {'Vuoi continuare?'}
        </>
      ),
      confirmLabel: 'Conferma',
      closeLabel: 'Annulla',
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
          title: `UTENTE DISSOCIATO`,
          message: (
            <>
              {`Hai dissociato correttamente `}
              <strong>{`${member.name} ${member.surname} `}</strong>
              {'dal gruppo '}
              <strong>{`${partyGroup.name}`}</strong>
              {'.'}
            </>
          ),
          component: 'Toast',
        });
      })
      .catch((reason) =>
        addError({
          component: 'Toast',
          id: `DISSOCIATE_PARTY_USER_ERROR-${member.id}`,
          displayableTitle: `ERRORE DURANTE LA DISSOCIAZIONE DELL'UTENTE `,
          techDescription: `C'è stato un errore durante la dissociazione dell'utente (${member.id})`,
          blocking: false,
          error: reason,
          toNotify: true,
          displayableDescription: `C'è stato un errore durante la dissociazione dell'utente (${member.id})`,
        })
      )
      .finally(() => setLoading(false));
  };
  return (
    <>
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
          <MenuItem onClick={confirmDisociateAction}>Dissocia dal gruppo</MenuItem>
        </Box>
        {userProduct?.roles.length === 1 && !member.isCurrentUser && (
          <Box key={userProduct.id}>
            <Box width="170px" margin="4px auto">
              <Divider />
            </Box>
            <Box width="100%" display="flex" justifyContent="center">
              <MenuItem onClick={confirmAction}>
                {role?.status === 'ACTIVE'
                  ? 'Sospendi Referente'
                  : role?.status === 'SUSPENDED'
                  ? 'Riabilita Referente'
                  : ''}
              </MenuItem>
            </Box>
          </Box>
        )}
      </Menu>
    </>
  );
}
