/* eslint-disable sonarjs/cognitive-complexity */
import { Grid, Link, Box, Divider, IconButton, Typography, MenuItem, Menu } from '@mui/material';
import { useHistory } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import { PartyGroupExt } from '../../../model/PartyGroup';
import { DASHBOARD_ROUTES } from '../../../routes';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';
import { Product } from '../../../model/Product';
import { Party, UserStatus } from '../../../model/Party';
import { ProductRolesLists, transcodeProductRole2Title } from '../../../model/ProductRole';
import { updatePartyUserStatus } from '../../../services/usersService';
import { PartyUserProduct, PartyUserProductRole } from '../../../model/PartyUser';
import { deleteGroupRelation } from './../../../services/groupsService';

type Props = {
  partyGroup: PartyGroupExt;
  fetchPartyGroup: () => void;
  product: Product;
  party: Party;
  isSuspended: boolean;
  productRolesLists: ProductRolesLists;
};

export default function MemberGroup({
  partyGroup,
  fetchPartyGroup,
  product,
  party,
  isSuspended,
  productRolesLists,
}: Props) {
  const ITEM_HEIGHT = 48;

  const history = useHistory();
  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container py={2}>
      {partyGroup.members.map((member, index) => {
        const userProduct = member.products.find((p) => p.id === product.id);
        const role = userProduct?.roles[0];
        const handleOpen = () => {
          addNotify({
            component: 'SessionModal',
            id: 'Notify_Example',
            title: role?.status === 'ACTIVE' ? 'Sospendi Ruolo' : 'Riabilita Ruolo',
            message: (
              <>
                {role?.status === 'ACTIVE'
                  ? 'Stai per sospendere il ruolo '
                  : 'Stai per riabilitare il ruolo '}
                <strong>
                  {transcodeProductRole2Title(role?.role as string, productRolesLists)}
                </strong>
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
            role?.status === 'ACTIVE'
              ? 'SUSPENDED'
              : role?.status === 'SUSPENDED'
              ? 'ACTIVE'
              : undefined;
          const selectedUserStatus = nextStatus === 'SUSPENDED' ? 'sospeso' : 'riabilitato';

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

          handleClose();
          setLoading(true);
          updatePartyUserStatus(
            party,
            member,
            userProduct as PartyUserProduct,
            role as PartyUserProductRole,
            nextStatus
          )
            .then((_) => {
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
                id: 'UPDATE_PARTY_USER_STATUS',
                blocking: false,
                error: reason,
                techDescription: `An error occurred while updating party (${party.institutionId}) user (${member.id}): ${member.status} -> ${nextStatus}`,
                toNotify: true,
              })
            )
            .finally(() => setLoading(false));
        };

        return (
          <Grid key={member.id} item container>
            <Grid item xs={4}>
              <Link
                component="button"
                disabled={isSuspended || role?.status === 'SUSPENDED'}
                sx={{
                  width: '100%',
                  textDecoration: 'none',
                  fontWeight: 600,
                  cursor: isSuspended || role?.status === 'SUSPENDED' ? 'text' : 'pointer',
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
                  <Box mr={1}>
                    <Typography
                      className="ShowDots"
                      sx={{
                        color: isSuspended || role?.status === 'SUSPENDED' ? '#a2adb8' : '#0073E6',
                        fontWeight: 600,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flexStart',
                      }}
                      title={member.name}
                    >
                      {member.name}
                    </Typography>
                  </Box>
                  <Box mr={1}>
                    <Typography
                      sx={{
                        color: isSuspended || role?.status === 'SUSPENDED' ? '#a2adb8' : '#0073E6',
                        fontWeight: 600,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flexStart',
                      }}
                      className="ShowDots"
                      title={member.surname}
                    >
                      {member.surname}
                    </Typography>
                  </Box>
                </Box>
              </Link>
            </Grid>
            <Grid item xs={4}>
              <Typography
                className="ShowDot"
                color={
                  role?.status === 'SUSPENDED' || partyGroup.status === 'SUSPENDED'
                    ? '#9E9E9E'
                    : undefined
                }
                width="100%"
                title={member.email}
              >
                {member.email}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              {userProduct?.roles?.map((r, index) => (
                <Box key={index}>
                  <Typography
                    color={
                      r.status === 'SUSPENDED' || partyGroup.status === 'SUSPENDED'
                        ? '#9E9E9E'
                        : undefined
                    }
                  >
                    {transcodeProductRole2Title(r.role, productRolesLists)}
                  </Typography>
                </Box>
              ))}
            </Grid>
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
              {/* TODO: add control && !member.isCurrentUser */}
              {userProduct?.roles.length === 1 && (
                <Box key={index}>
                  <Box width="170px" margin="4px auto">
                    <Divider />
                  </Box>
                  <Box width="100%" display="flex" justifyContent="center">
                    <MenuItem onClick={handleOpen}>
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
            {index !== partyGroup.members.length - 1 && (
              <Grid item xs={12} py={2}>
                <Divider />
              </Grid>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
}
