import React, { useEffect, useState } from 'react';
import { Grid, Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Party } from '../../model/Party';
import { URL_FE_LANDING } from '../../utils/env';
import { roleLabels } from '../../utils/constants';
import PartyItemContainer from './../../components/partySelectionSearch/PartyItemContainer';

type Props = {
  parties: Array<Party>;
};

export default function NoActiveParty({ parties }: Props) {
  const bodyTitle = 'Non risultano richieste di adesione per il tuo Ente';
  const bodyDescription = "L'adesione potrebbe essere ancora in corso.";
  const bodyDescription2 = 'Verifica di aver completato tutti i passaggi richiesti.';
  const [filteredParties, setFilteredParties] = useState<Array<Party>>(parties);

  useEffect(() => {
    setFilteredParties(parties);
  }, []);

  return (
    <React.Fragment>
      <Grid
        direction="column"
        container
        display="flex"
        justifyContent="center"
        spacing={2}
        my={'auto'}
        sx={{ textAlign: 'center' }}
      >
        <Grid item container justifyContent="center">
          <Grid item xs={4}>
            <Box>
              <Typography variant="h3" component="h2">
                {bodyTitle}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center">
          <Grid item xs={4}>
            <Box>
              <Typography variant="subtitle2" component="h2">
                {bodyDescription}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" component="h2">
                {bodyDescription2}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center">
          <Grid item xs={3}>
            <Box>
              {filteredParties &&
                filteredParties.map((party) => {
                  const isDisabled = party.status === 'PENDING';
                  return (
                    <PartyItemContainer
                      isDisabled={isDisabled}
                      disabled={isDisabled}
                      key={party.institutionId}
                      title={party.description}
                      subTitle={roleLabels[party.userRole].longLabel}
                      titleColor={isDisabled ? '' : '#0073E6'}
                      image={party.urlLogo}
                      chip={party.status === 'PENDING' ? 'Da completare' : ''}
                    />
                  );
                })}
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={2} mt={4}>
          <Button
            variant="contained"
            sx={{ width: '190px', height: '40px' }}
            onClick={() => window.location.assign(URL_FE_LANDING)}
          >
            Torna alla Home
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
