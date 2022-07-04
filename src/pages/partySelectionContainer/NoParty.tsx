import React, { useEffect } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { IllusError } from '@pagopa/mui-italia';
import { ENV } from '../../utils/env';

export default function NoParty() {
  const bodyTitle = 'Il tuo profilo non è associato a nessun Ente.';
  const bodyDescription =
    'Per accedere all’Area Riservata, chiedi a un Amministratore di aggiungerti nella sezione Utenti.';

  useEffect(() => {
    trackEvent('DASHBOARD_ASSOCIATION_FAILURE', { event_name: 'DASHBOARD_ASSOCIATION_FAILURE' });
  }, []);

  return (
    <React.Fragment>
      <IllusError size={60} />
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
          </Grid>
        </Grid>

        <Grid item xs={2} mt={4}>
          <Button
            variant="contained"
            sx={{ width: '190px', height: '40px' }}
            onClick={() => window.location.assign(ENV.URL_FE.LANDING)}
          >
            Torna alla Home
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
