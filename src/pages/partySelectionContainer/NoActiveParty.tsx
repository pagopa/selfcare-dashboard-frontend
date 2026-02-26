import { Grid, Button, Typography, Box, Paper, useTheme } from '@mui/material';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { Trans, useTranslation } from 'react-i18next';
import { ENV } from '../../utils/env';
import { BaseParty } from '../../model/Party';
import PartyItemContainer from './../../components/partySelectionSearch/PartyItemContainer';

type Props = {
  parties: Array<BaseParty>;
};

export default function NoActiveParty({ parties }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();

  const pendingAdhesion = parties.find((p) => p.status === 'PENDING');

  return (
    <Grid container display="flex" justifyContent="center" spacing={1} my={'auto'}>
      <Grid item xs={12} display="flex" justifyContent="center">
        <Typography variant="h3" sx={{ lineHeight: '1.1 !important' }} textAlign="center">
          {pendingAdhesion ? (
            <Trans i18nKey="noActiveParty.pending.title">
              Non risultano richieste di <br />
              adesione per questo ente
            </Trans>
          ) : (
            <Trans i18nKey='noActiveParty.toBeValidated.title"'>
              La richiesta di registrazione è <br />
              in attesa di validazione
            </Trans>
          )}
        </Typography>
      </Grid>
      <Grid item xs={12} mb={2} display="flex" justifyContent="center">
        <Box>
          <Typography variant="body1" textAlign="center">
            {pendingAdhesion ? (
              <Trans i18nKey="noActiveParty.pending.description">
                L&apos;adesione potrebbe essere ancora in corso.
                <br />
                Verifica che tutti i passaggi richiesti siano stati completati.
              </Trans>
            ) : (
              <Trans i18nKey="noActiveParty.toBeValidated.description">
                La richiesta di registrazione per l’ente {{ partyName: parties[0].description }}
                deve <br />
                essere ancora confermata. Per accedere, attendi la conferma <br />
                che arriverà all’indirizzo PEC dell’ente.
              </Trans>
            )}
          </Typography>
        </Box>
      </Grid>

      <Grid item container justifyContent="center">
        <Paper
          className="paper-test"
          elevation={8}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '480px',
            height: '97px',
            borderRadius: theme.spacing(2),
          }}
        >
          <Grid item xs={12} p={2}>
            {parties &&
              parties.map((party) => (
                <PartyItemContainer
                  key={party.partyId}
                  image={party.urlLogo}
                  title={party.description}
                  subTitle={t(roleLabels[party.userRole]?.longLabelKey)}
                  isDisabled={true}
                  chip={
                    party.status === 'PENDING'
                      ? t('partySelection.partyStatus.pending')
                      : party.status === 'TOBEVALIDATED'
                        ? t('partySelection.partyStatus.toBeValidated')
                        : ''
                  }
                  parentPartyName={party.parentDescription}
                />
              ))}
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={2} mt={2} display="flex" justifyContent="center">
        <Button
          variant="contained"
          sx={{ height: '40px' }}
          onClick={() => window.location.assign(ENV.URL_FE.LANDING)}
        >
          {t('noActiveParty.close')}
        </Button>
      </Grid>
    </Grid>
  );
}
