import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import { Party, UserStatus } from '../../../../../model/Party';
import { LOADING_TASK_ACTION_ON_PARTY_GROUP } from '../../../../../utils/constants';
import { PartyGroup, PartyGroupStatus } from '../../../../../model/PartyGroup';
import { Product } from '../../../../../model/Product';
import { deletePartyGroup, updatePartyGroupStatus } from '../../../../../services/groupsService';

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
          {actionMessage}
          {' il gruppo '}
          <strong>{`${partyGroup.name}`}</strong>
          {' di '}
          <strong>{`${product.title}`}</strong>
          {'.'}
          <br />
          {'Vuoi continuare?'}
        </>
      ),
      onConfirm,
      confirmLabel: 'Conferma',
    });
  };

  const performAction = (
    action: () => Promise<void>,
    title: string,
    actionMessage: string,
    onComplete: () => void
  ) => {
    setLoading(true);
    action()
      .then((_) => {
        onComplete();

        addNotify({
          id: 'ACTION_ON_PARTY_GROUP_COMPLETED',
          title,
          message: (
            <>
              {actionMessage}
              {' il gruppo '}
              <strong>{`${partyGroup.name}`}</strong>
              {'.'}
            </>
          ),
          component: 'Toast',
        });
      })
      .catch((reason) =>
        addError({
          id: 'ACTION_ON_PARTY_GROUP_ERROR',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while performing action ${title} on party (${party.institutionId}) and group (${partyGroup.id})`,
          toNotify: true,
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
      nextStatus === 'SUSPENDED' ? 'Sospendi Gruppo' : 'Riattiva Gruppo',
      nextStatus === 'SUSPENDED' ? 'Stai per sospendere' : 'Stai per riattivare',
      () => updateStatus(nextStatus)
    );
  };

  const updateStatus = (nextStatus: PartyGroupStatus) => {
    const selectedUserStatus = nextStatus === 'SUSPENDED' ? 'sospeso' : 'riattivato';
    performAction(
      () => updatePartyGroupStatus(party, product, partyGroup, nextStatus),
      `REFERENTE ${selectedUserStatus.toUpperCase()}`,
      `Hai ${selectedUserStatus} correttamente`,
      () => onStatusUpdate(partyGroup, nextStatus)
    );
  };

  const handleDelete = () => {
    handleClose();
    askConfirm('Elimina Gruppo', 'Stai per eliminare', deleteGroup);
  };

  const deleteGroup = () => {
    performAction(
      () => deletePartyGroup(party, product, partyGroup),
      'GRUPPO ELIMINATO',
      'Hai eliminato correttamente',
      () => onDelete(partyGroup)
    );
  };

  const handleModify = () => {
    handleClose();
    history.push(
      resolvePathVariables('' /* TODO url to edit group */, {
        institutionId: party.institutionId,
        groupId: partyGroup.id,
      })
    );
  };

  const handleClone = () => {
    handleClose();
    history.push(
      resolvePathVariables('CLONE' /* TODO url to clone group */, {
        institutionId: party.institutionId,
        groupId: partyGroup.id,
      })
    );
  };

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
        <MenuItem onClick={handleModify}>Modifica</MenuItem>
        <MenuItem onClick={handleClone}>Duplica</MenuItem>
        <MenuItem onClick={handleChangeState}>
          {partyGroup.status === 'ACTIVE'
            ? 'Sospendi'
            : partyGroup.status === 'SUSPENDED'
            ? 'Riabilita'
            : ''}
        </MenuItem>
        <MenuItem onClick={handleDelete}>Elimina</MenuItem>
      </Menu>
    </div>
  );
}
