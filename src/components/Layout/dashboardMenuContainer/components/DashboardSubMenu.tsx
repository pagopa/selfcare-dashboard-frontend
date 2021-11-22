import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { IconButton, Grid, Divider, Button, Popper, ClickAwayListener, Paper } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useHistory } from 'react-router';
import { uniqueId } from 'lodash';
import { Party } from '../../../../model/Party';
import PartySelectionSearch from '../../../partySelectionSearch/PartySelectionSearch';
import ROUTES, { resolvePathVariables } from '../../../../routes';
import { URL_FE_LOGOUT } from '../../../../utils/constants';
import { useParties } from '../../../../hooks/useParties';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { AppError, appStateActions } from '../../../../redux/slices/appStateSlice';
import LogoSubMenu from './LogoSubMenu';

type Props = {
  ownerName: string;
  description: string;
  role: string;
  selectedParty: Party;
};

export default function DashboardSubMenu({ ownerName, description, role, selectedParty }: Props) {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const history = useHistory();
  const parties = useAppSelector(partiesSelectors.selectPartiesList);
  const setParties = (parties: Array<Party>) => dispatch(partiesActions.setPartiesList(parties));
  const [parties2Show, setParties2Show] = useState<Array<Party>>();
  const addError = (error: AppError) => dispatch(appStateActions.addError(error));
  const { fetchParties } = useParties();

  const doFetch = (): void => {
    fetchParties()
      .then((parties) => {
        setParties(parties);
        setParties2Show(
          parties.filter(
            (p) => p.status === 'ACTIVE' && p.institutionId !== selectedParty.institutionId
          )
        );
      })
      .catch((reason) => {
        addError({
          id: uniqueId('dashboardSubmenu-'),
          blocking: false,
          error: reason,
          techDescription: 'An error occurred while fetching parties opening dashboard submenu',
          onRetry: doFetch,
        });
      });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (!parties) {
      doFetch();
    } else {
      setParties2Show(
        parties.filter(
          (p) => p.status === 'ACTIVE' && p.institutionId !== selectedParty.institutionId
        )
      );
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container justifyContent="center">
      <Grid item>
        <IconButton onClick={handleClick}>
          {open ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
        </IconButton>
        <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-end">
          <ClickAwayListener onClickAway={handleClose}>
            <Paper
              sx={{
                style: {
                  boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)',
                  borderRadius: '0px 0px 3px 3px',
                  width: '392px',
                  marginTop: '15px',
                },
              }}
            >
              <Grid container px={4} width="392px" maxHeight="520px">
                <Grid item xs={12} mt={4} mb={4}>
                  <Typography variant="h3" sx={{ fontSize: '26px' }}>
                    {ownerName}
                  </Typography>
                </Grid>
                <Grid item xs={10} mb={4}>
                  <LogoSubMenu title={description} color="" subTitle={role} />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ border: '1px solid #CCD4DC' }} />
                </Grid>
                <Grid item mx={3} mb={3} xs={12}>
                  {parties2Show && (
                    <PartySelectionSearch
                      disableUnderline={true}
                      parties={parties2Show}
                      onPartySelectionChange={(selectedParty: Party | null) => {
                        if (selectedParty) {
                          handleClose();
                          history.push(
                            resolvePathVariables(ROUTES.PARTY_DASHBOARD.path, {
                              institutionId: selectedParty.institutionId,
                            })
                          );
                        }
                      }}
                    />
                  )}
                </Grid>
                <Grid container item mb={3} justifyContent="center">
                  <Grid item xs={8}>
                    <Button
                      variant="contained"
                      sx={{ height: '40px', width: '100%' }}
                      onClick={() => window.location.assign(URL_FE_LOGOUT)}
                    >
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </ClickAwayListener>
        </Popper>
      </Grid>
    </Grid>
  );
}
