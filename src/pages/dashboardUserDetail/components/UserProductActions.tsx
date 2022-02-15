import { Link, Grid, Typography } from '@mui/material';
import { SessionModal } from '@pagopa/selfcare-common-frontend';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import { useState } from 'react';
import { Party, UserStatus } from '../../../model/Party';
import { PartyUser } from '../../../model/PartyUser';
import { Product } from '../../../model/Product';
import { ProductRole } from '../../../model/ProductRole';
import { updatePartyUserStatus } from '../../../services/usersService';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';

type Props = {
  showActions: boolean;
  party: Party;
  productRoles: Array<ProductRole>;
  user: PartyUser;
  selectedProduct?: Product;
  fetchPartyUsers: () => void;
};
export default function UserProductActions({
  showActions,
  party,
  productRoles,
  user,
  fetchPartyUsers,
}: Props) {
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();

  const onDelete = () => {
    setLoading(true);
    // deletePartyUser(user)
    // .then((_) => {
    setOpenDeleteModal(false);
    fetchPartyUsers();
    // })
    // .catch
    // TODO: add delete fetch
  };

  const handleOpenDelete = () => {
    setOpenDeleteModal(true);
  };

  const confirmChangeStatus = () => {
    const nextStatus: UserStatus | undefined =
      user.status === 'ACTIVE' ? 'SUSPENDED' : user.status === 'SUSPENDED' ? 'ACTIVE' : undefined;
    if (!nextStatus) {
      addError({
        id: 'INVALID_STATUS_TRANSITION',
        blocking: false,
        error: new Error('INVALID_STATUS_TRANSITION'),
        techDescription: `Invalid status transition while updating party (${party.institutionId}) user (${user.id}): ${user.status}`,
        toNotify: true,
      });

      return;
    }

    setLoading(true);
    updatePartyUserStatus(user, nextStatus)
      .then((_) => {
        setOpenModal(false);
        fetchPartyUsers();
      })
      .catch((reason) =>
        addError({
          id: 'UPDATE_PARTY_USER_STATUS',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while updating party (${party.institutionId}) user (${user.id}): ${user.status} -> ${nextStatus}`,
          toNotify: true,
        })
      )
      .finally(() => setLoading(false));
  };
  const handleOpen = () => {
    addNotify({
      component: 'SessionModal',
      id: 'Notify_Example',
      title: party?.status === 'ACTIVE' ? 'Sospendi Referente' : 'Riabilita Referente',
      message: (
        <>
          {party?.status === 'ACTIVE' ? 'Stai per sospendere ' : 'Stai per riabilitare '}
          <strong style={{ textTransform: 'capitalize' }}>
            {party && `${user.name.toLocaleLowerCase()} ${user.surname}`}
          </strong>
          {'.'}
          <br />
          {'Vuoi continuare?'}
        </>
      ),
      confirmLabel: "Conferma",
      closeLabel: "Annulla",
      onConfirm: confirmChangeStatus
    });
  };

  return (
    <>
      {showActions && (
        <Grid container item>
          <Grid item xs={6}>
            <Link onClick={handleOpen}>
              <Typography variant="h3" sx={{ fontSize: '16px', color: '#0073E6' }}>
                {party?.status === 'SUSPENDED'
                  ? 'Riabilita'
                  : party?.status === 'ACTIVE'
                  ? 'Sospendi'
                  : ''}
              </Typography>
            </Link>
          </Grid>
          {/* TODO: nel then faccio il fetchPartyUsers */}
          {productRoles.length > 1 && (
            <Grid item xs={6}>
              <Link color="error" onClick={handleOpenDelete}>
                <Typography variant="h3" sx={{ fontSize: '16px', color: '#C02927' }}>
                  Elimina
                </Typography>
              </Link>
            </Grid>
          )}
        </Grid>
      )}

    </>
  );
}
