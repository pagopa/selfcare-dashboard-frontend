import React from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { PartyUser, PartyUserProduct } from '../../../../../model/PartyUser';
import { Party } from '../../../../../model/Party';

type Props = {
  party: Party;
  partyUser: PartyUser;
  partyUserProduct: PartyUserProduct;
  onChangeState: (user: PartyUser) => void;
};

const ITEM_HEIGHT = 48;

export default function UserProductRowActions({ party, partyUser, onChangeState }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const history = useHistory();

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeState = () => {
    handleClose();
    onChangeState(partyUser);
  };

  const handleDelete = () => {
    handleClose();
    // TODO
  };

  const handleModify = () => {
    handleClose();
    history.push(
      resolvePathVariables('' /* TODO use route to modify user registry */, {
        institutionId: party.institutionId,
        userId: partyUser.id,
      })
    );
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
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
        <MenuItem onClick={handleChangeState}>
          {partyUser.status === 'ACTIVE'
            ? 'Sospendi'
            : partyUser.status === 'SUSPENDED'
            ? 'Riabilita'
            : ''}
        </MenuItem>
        <MenuItem onClick={handleDelete}>Elimina</MenuItem>
      </Menu>
    </div>
  );
}
