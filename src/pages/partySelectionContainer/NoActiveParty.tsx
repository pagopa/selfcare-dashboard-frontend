import React, { useEffect, useState } from 'react';
import { Grid, Button, Typography, Box, Paper, useTheme } from '@mui/material';
import { roleLabels } from '@pagopa/selfcare-common-frontend/utils/constants';
import { Trans, useTranslation } from 'react-i18next';
import { Party } from '../../model/Party';
import { ENV } from '../../utils/env';
import PartyItemContainer from './../../components/partySelectionSearch/PartyItemContainer';

type Props = {
  parties: Array<Party>;
};

export default function NoActiveParty({ parties }: Props) {
  const { t } = useTranslation();
  const [filteredParties, setFilteredParties] = useState<Array<Party>>(parties);
  const theme = useTheme();

  useEffect(() => {
    setFilteredParties(parties);
  }, []);

  return (
    <React.Fragment>
      <Grid container display="flex" justifyContent="center" spacing={1} my={'auto'}>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Typography variant="h3" sx={{ lineHeight: '1.1 !important' }} textAlign="center">
            <Trans i18nKey="NoActiveParty.bodyTitle">
              Non risultano richieste di <br />
              adesione per questo Ente
            </Trans>
          </Typography>
        </Grid>
        <Grid item xs={12} mb={2} display="flex" justifyContent="center">
          <Box>
            <Typography variant="body1" textAlign="center">
              <Trans i18nKey="NoActiveParty.bodyDescription">
                L&apos;adesione potrebbe essere ancora in corso.
                <br />
                Verifica di aver completato tutti i passaggi richiesti.
              </Trans>
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
              borderRadius: theme.spacing(2),
            }}
          >
            <Grid item xs={10}>
              <Box>
                {filteredParties &&
                  filteredParties.map((party) => {
                    const isDisabled = party.status === 'PENDING';
                    return (
                      <PartyItemContainer
                        isDisabled={isDisabled}
                        key={party.partyId}
                        title={party.description}
                        subTitle={t(roleLabels[party.userRole].longLabelKey)}
                        image={party.urlLogo}
                        chip={
                          party.status === 'PENDING'
                            ? t('partySelection.partyStatus.pending')
                            : party.status === 'TOBEVALIDATED'
                            ? t('partySelection.partyStatus.toBeValidated')
                            : ''
                        }
                        parentPartyName={party.parentDescription}
                      />
                    );
                  })}
              </Box>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={2} mt={2} display="flex" justifyContent="center">
          <Button
            variant="contained"
            sx={{ height: '40px' }}
            onClick={() => window.location.assign(ENV.URL_FE.LANDING)}
          >
            {t('NoActiveParty.backButton')}
          </Button>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
