import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { IconButton, Grid, Divider, Button, Popper, ClickAwayListener, Paper } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useHistory } from 'react-router';
import { uniqueId } from 'lodash';
import styled from '@emotion/styled';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { Party } from '../../../../model/Party';
import PartySelectionSearch from '../../../partySelectionSearch/PartySelectionSearch';
import ROUTES from '../../../../routes';
import { ENV } from '../../../../utils/env';
import { useParties } from '../../../../hooks/useParties';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { partiesActions, partiesSelectors } from '../../../../redux/slices/partiesSlice';
import LogoSubMenu from './LogoSubMenu';

const CustomIconButton = styled(IconButton)({
  '&:hover': { backgroundColor: 'transparent' },
});

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
  const addError = useErrorDispatcher();
  const fetchParties = useParties();

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
          toNotify: true,
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
    <Grid container justifyContent="center" sx={{ height: '100%' }}>
      <Grid item>
        <CustomIconButton onClick={handleClick} sx={{ height: '100%' }} disableRipple={true}>
          {open ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
        </CustomIconButton>
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
              <Grid container px={4} width="392px" maxHeight="560px">
                <Grid item xs={12} mt={4} mb={4}>
                  <Typography variant="h3" sx={{ fontSize: '26px' }}>
                    {ownerName}
                  </Typography>
                </Grid>
                <Grid item xs={10} mb={4}>
                  <LogoSubMenu title={description} subTitle={role} />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ borderColor: '#CCD4DC' }} />
                </Grid>
                <Grid item mb={3} xs={12}>
                  {parties2Show && (
                    <PartySelectionSearch
                      partyTitle="I tuoi enti"
                      pxTitleSubTitle="32px"
                      iconMarginRight="-10px"
                      showAvatar={false}
                      iconColor="#0073E6"
                      label="I tuoi enti"
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
                      onClick={() => window.location.assign(ENV.URL_FE.LOGOUT)}
                    >
                      Esci
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
