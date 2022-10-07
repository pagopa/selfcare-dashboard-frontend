import React, { useEffect } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { IllusError } from '@pagopa/mui-italia';
import { useTranslation, Trans } from 'react-i18next';
import { ENV } from '../../utils/env';

export default function NoParty() {
  const { t } = useTranslation();

  const bodyTitle = t('noParty.title');

  useEffect(() => {
    trackEvent('DASHBOARD_ASSOCIATION_FAILURE', { event_name: 'DASHBOARD_ASSOCIATION_FAILURE' });
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
            <Grid mb={4}>
              <IllusError size={70} />
            </Grid>
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
              <Typography variant="body1">
                <Trans i18nKey="noParty.description">
                  L’Area Riservata è dedicata agli enti che utilizzano i prodotti <br /> di PagoPA.
                  Se lavori per un ente, chiedi a un <br /> Amministratore di aggiungerti nella
                  sezione Utenti.
                </Trans>
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={2} mt={3}>
          <Button
            variant="contained"
            sx={{
              height: '46px',
              fontSize: 'fontSize',
            }}
            onClick={() => window.location.assign(ENV.URL_FE.LANDING)}
          >
            {t('noParty.backHome')}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
