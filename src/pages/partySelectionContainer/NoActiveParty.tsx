import React, { useEffect, useState } from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
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

  // const bodyTitle = 'Non risultano richieste di adesione per il tuo Ente';
  // const bodyDescription = "L'adesione potrebbe essere ancora in corso.";
  // const bodyDescription2 = 'Verifica di aver completato tutti i passaggi richiesti.';
  const [filteredParties, setFilteredParties] = useState<Array<Party>>(parties);

  useEffect(() => {
    setFilteredParties(parties);
  }, []);

  return (
    <React.Fragment>
      <Grid container display="flex" justifyContent="center" spacing={2} my={'auto'}>
        <Grid item xs={12} display="flex" justifyContent="center">
          <Typography variant="h3" sx={{ lineHeight: '1.1' }} textAlign="center">
            <Trans i18nKey="NoActiveParty.bodyTitle">
              Non risultano richieste di adesione
              <br />
              per il tuo Ente
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
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '480px',
              borderRadius: '16px',
              boxShadow:
                '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1);',
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
                        chip={party.status === 'PENDING' ? 'Da completare' : ''}
                      />
                    );
                  })}
              </Box>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={2} mt={2}>
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
