import { Grid, Link, Box, Divider, IconButton, Typography, MenuItem, Menu } from '@mui/material';
import { useHistory } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { PartyGroupExt } from '../../../model/PartyGroup';
import { DASHBOARD_ROUTES } from '../../../routes';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';
import { Product } from '../../../model/Product';
import { Party } from '../../../model/Party';
import { deleteGroupRelation } from './../../../services/groupsService';

type Props = {
  groupStatusClass: string;
  partyGroup: PartyGroupExt;
  fetchPartyGroup: () => void;
  product: Product;
  party: Party;
  isSuspended: boolean;
};

export default function MembersGroup({
  partyGroup,
  fetchPartyGroup,
  product,
  party,
  groupStatusClass,
  isSuspended,
}: Props) {
  // console.log('partyGroup', partyGroup);

  const ITEM_HEIGHT = 48;
  const roleLabelsGroup = {
    ADMIN: {
      title: 'Ref. Amministrativo',
    },
    LIMITED: {
      title: 'Ref. Operativo',
    },
  };

  const history = useHistory();
  const addError = useErrorDispatcher();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // TODO:  insert the correct behavior onChangeMemberState
  const handleChangeMemberState = () => {
    handleClose();
  };

  return (
    <Grid container>
      {partyGroup.members.map((member, index) => (
        <Grid key={member.id} item container>
          <Grid item xs={3}>
            <Link
              sx={{
                textDecoration: 'none',
                fontWeight: 600,
                cursor: 'pointer',
                color: isSuspended ? '#a2adb8' : '#0073E6',
              }}
              onClick={() =>
                history.push(
                  resolvePathVariables(
                    DASHBOARD_ROUTES.PARTY_USERS.subRoutes.PARTY_USER_DETAIL.path,
                    {
                      institutionId: partyGroup.institutionId,
                      groupId: partyGroup.id,
                      userId: member.id,
                    }
                  )
                )
              }
            >
              <Box display="flex">
                <Box mr={1}>{member.name}</Box>
                <Box>{member.surname}</Box>
              </Box>
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Typography
              className={`${groupStatusClass} ShowDots`}
              width="100%"
              title={member.email}
            >
              {member.email}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography className={groupStatusClass}>
              {roleLabelsGroup[member.userRole].title}
            </Typography>
          </Grid>
          <Grid item xs={1} display="flex" justifyContent="flex-end">
            <IconButton
              sx={{ p: '0px', ':hover': { backgroundColor: 'transparent' } }}
              disableRipple
              onClick={handleClick}
            >
              <MoreVertIcon color="primary" />
            </IconButton>
          </Grid>
          {index !== partyGroup.members.length - 1 && (
            <Grid item xs={12}>
              <Divider />
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
              <MenuItem
                onClick={() => {
                  setLoading(true);
                  deleteGroupRelation(party, product, partyGroup, member.id)
                    .then((_) => {
                      handleClose();
                      fetchPartyGroup();
                    })
                    .catch((reason) =>
                      addError({
                        id: `DELETE_PARTY_GROUP_ERROR-${partyGroup.id}`,
                        blocking: false,
                        error: reason,
                        techDescription: `Something gone wrong while deleting group ${partyGroup.name}`,
                        toNotify: true,
                      })
                    )
                    .finally(() => setLoading(false));
                }}
              >
                Dissocia dal gruppo
              </MenuItem>
            </Box>
            <Box width="170px" margin="4px auto">
              <Divider />
            </Box>
            <Box width="100%" display="flex" justifyContent="center">
              <MenuItem onClick={handleChangeMemberState}>
                {member.status === 'ACTIVE'
                  ? 'Sospendi Referente'
                  : member.status === 'SUSPENDED'
                  ? 'Riabilita Referente'
                  : ''}
              </MenuItem>
            </Box>
          </Menu>
        </Grid>
      ))}
    </Grid>
  );
}
