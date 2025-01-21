import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { ButtonNaked, IllusError } from '@pagopa/mui-italia';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ENV } from '../../utils/env';

export default function NoParty() {
  const { t } = useTranslation();

  const bodyTitle = t('noParty.title');

  useEffect(() => {
    trackEvent('DASHBOARD_ASSOCIATION_FAILURE', { event_name: 'DASHBOARD_ASSOCIATION_FAILURE' });
  }, []);

  return (
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
                L’Area Riservata è dedicata agli enti che utilizzano i prodotti <br /> PagoPA. Se
                lavori per un ente, chiedi a un Amministratore <br /> di aggiungerti nella sezione
                Utenti.
              </Trans>
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid>
        <ButtonNaked
          component="button"
          color="primary"
          startIcon={<MenuBookIcon />}
          sx={{ fontWeight: 'fontWeightBold', fontSize: 'fontSize' }}
          onClick={() => {
            window.open('https://docs.pagopa.it/area-riservata/area-riservata/ruoli');
          }}
        >
          {t('noParty.moreInformationOnRoles')}
        </ButtonNaked>
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

      <Grid mt={5}>
        <Typography variant="body1" color={'#5C6F82'}>
          <Trans i18nKey={'noParty.addAdmin'}>
            Gli attuali Amministratori non sono più disponibili e hai l’esigenza <br /> di gestire i
            prodotti?
            <Link
              color="#0073E6"
              href={`${ENV.URL_FE.ONBOARDING}/user`}
              underline="none"
              sx={{ fontSize: '18px', cursor: 'pointer' }}
            >
              Aggiungi un nuovo Amministratore
            </Link>
          </Trans>
        </Typography>
      </Grid>
    </Grid>
  );
}
