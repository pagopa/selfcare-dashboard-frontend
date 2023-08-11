import React, { useEffect } from 'react';
import { Grid, Button, Paper, useTheme, Typography, Stack } from '@mui/material';
import { useHistory } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { useTranslation, Trans } from 'react-i18next';
import PartySelectionSearch from '../../../components/partySelectionSearch/PartySelectionSearch';
import ROUTES from '../../../routes';
import { useAppDispatch } from '../../../redux/hooks';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import { BaseParty } from '../../../model/Party';

type Props = {
  parties: Array<BaseParty>;
};

export default function PartySelection({ parties }: Props) {
  const { t } = useTranslation();
  const bodyTitle = t('partySelection.title');
  const theme = useTheme();
  const [selectedParty, setSelectedParty] = React.useState<BaseParty | null>(
    parties.length === 1 ? parties[0] : null
  );
  const [disableBtn, setBtnDisable] = React.useState(true);
  const history = useHistory();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(partiesActions.setPartySelected(undefined));
    dispatch(partiesActions.setPartySelectedProducts(undefined));
  }, []);

  useEffect(() => {
    setBtnDisable(!selectedParty);
  }, [selectedParty]);

  return (
    <Grid
      direction="column"
      container
      display="flex"
      justifyContent="center"
      spacing={2}
      my={'auto'}
    >
      <Grid item container mb={3} xs={12}>
        <Grid item xs={12} mb={1} display="flex" justifyContent="center">
          <Typography variant="h3">{bodyTitle}</Typography>
        </Grid>
        <Grid item xs={18} display="flex" justifyContent="center">
          <Typography variant="body1" align="center">
            <Trans i18nKey="partySelection.subTitle">
              Se operi per più enti, potrai modificare la tua scelta dopo aver <br /> effettuato
              l’accesso.
            </Trans>
          </Typography>
        </Grid>
      </Grid>

      <Grid item display="flex" justifyContent="center" xs={12}>
        <Paper
          elevation={8}
          sx={{
            maxWidth: '480px',
            minWidth: '480px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.spacing(2),
          }}
        >
          <Grid container item xs={3} md={4} lg={3} sx={{ minWidth: '100%', p: 2 }}>
            <PartySelectionSearch
              iconColor={'#17324D'}
              label={t('partySelection.label')}
              parties={parties}
              selectedParty={selectedParty}
              onPartySelectionChange={(selectedParty: BaseParty | null) => {
                setSelectedParty(selectedParty);
              }}
            />
          </Grid>
        </Paper>
      </Grid>
      <Grid item container xs={12} display="flex" justifyContent="center" mt={4}>
        <Stack direction="row" display="flex" justifyContent="center">
          <Button
            variant="contained"
            disabled={disableBtn}
            onClick={() => {
              trackEvent('DASHBOARD_PARTY_SELECTION', { party_id: selectedParty?.partyId });
              history.push(
                resolvePathVariables(ROUTES.PARTY_DASHBOARD.path, {
                  partyId: selectedParty?.partyId ?? '',
                })
              );
            }}
          >
            {t('partySelection.continueButton')}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
