import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { IconButton, Grid, Divider, Button } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useHistory } from 'react-router';
import { Party } from '../../../../model/Party';
import PartySelectionSearch from '../../../partySelectionSearch/PartySelectionSearch';
import ROUTES, { resolvePathVariables } from '../../../../routes';
import { URL_FE_LOGOUT } from '../../../../utils/constants';
import { useParties } from '../../../../hooks/useParties';
import LogoSubMenu from './LogoSubMenu';

type Props = {
  ownerName: string;
  urlLogo?: string;
  description: string;
  role: string;
  selectedParty: Party;
};

export default function DashboardSubMenu({
  ownerName,
  urlLogo,
  description,
  role,
  selectedParty,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const history = useHistory();
  const [parties, setParties] = useState<Array<Party>>();
  const { fetchParties } = useParties();

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (!parties) {
      fetchParties()
        .then((parties) => {
          setParties(parties.filter((p) => p !== selectedParty && p.status === 'Active'));
        })
        .catch((reason) => {
          /* TODO  errorHandling */ console.error(reason);
          return [];
        });
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
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            style: {
              boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)',
              borderRadius: '0px 0px 3px 3px',
              width: '392px',
              height: '520px',
              marginTop: '15px',
            },
          }}
        >
          <Grid container px={4}>
            <Grid item xs={12} mt={4} mb={4}>
              <Typography variant="h3" sx={{ fontSize: '26px' }}>
                {ownerName}
              </Typography>
            </Grid>
            <Grid item xs={10} mb={4}>
              <LogoSubMenu urlLogo={urlLogo} title={description} subTitle={role} />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ border: '1px solid #CCD4DC' }} />
            </Grid>
            <Grid item mx={3} mb={2}>
              {parties && (
                <PartySelectionSearch
                  disableUnderline={true}
                  parties={parties}
                  onPartySelectionChange={(selectedParty: Party | null) =>
                    selectedParty &&
                    history.push(
                      resolvePathVariables(ROUTES.PARTY_DASHBOARD.path, {
                        institutionId: selectedParty.institutionId,
                      })
                    )
                  }
                />
              )}
            </Grid>
            <Grid container item mb={2} justifyContent="center">
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
        </Popover>
      </Grid>
    </Grid>
  );
}
