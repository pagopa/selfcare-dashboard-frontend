import React, { useEffect } from 'react';
import { Grid, Button, Paper, useTheme } from '@mui/material';
import { useHistory } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../model/Party';
import PartySelectionSearch from '../../../components/partySelectionSearch/PartySelectionSearch';
import ROUTES from '../../../routes';
import { useAppDispatch } from '../../../redux/hooks';
import { partiesActions } from '../../../redux/slices/partiesSlice';
import PartySelectionTitle from './components/PartySelectionTitle';

type Props = {
  parties: Array<Party>;
};

export default function PartySelection({ parties }: Props) {
  const { t } = useTranslation();
  const bodyTitle = t('partySelection.title');
  const bodyDescription = t('partySelection.subTitle');
  const theme = useTheme();
  const [selectedParty, setSelectedParty] = React.useState<Party | null>();
  const [disableBtn, setBtnDisable] = React.useState(true);
  const history = useHistory();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(partiesActions.setPartySelected(undefined));
    dispatch(partiesActions.setPartySelectedProducts(undefined));
  }, []);

  return (
    <Grid
      direction="column"
      container
      display="flex"
      justifyContent="center"
      spacing={2}
      my={'auto'}
    >
      <Grid item container justifyContent="center">
        <Grid item xs={8}>
          <PartySelectionTitle bodyTitle={bodyTitle} bodyDescription={bodyDescription} />
        </Grid>
      </Grid>

      <Grid item display="flex" justifyContent="center">
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
              onPartySelectionChange={(selectedParty: Party | null) => {
                setBtnDisable(selectedParty === null);
                setSelectedParty(selectedParty);
              }}
            />
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={2} display="flex" justifyContent="center">
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
      </Grid>
    </Grid>
  );
}
