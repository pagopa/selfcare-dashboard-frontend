import React from 'react';
import { Grid, Button } from '@mui/material';
import { useHistory } from 'react-router';
import { Party } from '../../../model/Party';
import PartySelectionSearch from '../../../components/partySelectionSearch/PartySelectionSearch';
import ROUTES, { resolvePathVariables } from '../../../routes';
import PartySelectionTitle from './components/PartySelectionTitle';

type Props = {
  parties: Array<Party>;
};

export default function PartySelection({ parties }: Props) {
  const bodyTitle = "Seleziona il tuo Ente";
  const bodyDescription =
    "Se operi per più Enti, puoi modificare la tua scelta all'interno del portale.";

  const [selectedParty, setSelectedParty] = React.useState<Party | null>();
  const [disableBtn, setBtnDisable] = React.useState(true);
  const history = useHistory();

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
        <Grid item xs={8}>
          <PartySelectionTitle bodyTitle={bodyTitle} bodyDescription={bodyDescription} />
        </Grid>
      </Grid>

      <Grid item display="flex" justifyContent="center">
        <Grid container item xs={3} md={4} lg={3}>
          <PartySelectionSearch
            parties={parties}
            onPartySelectionChange={(selectedParty: Party | null) => {
              setBtnDisable(selectedParty === null);
              setSelectedParty(selectedParty);
            }}
          />
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <Button
          variant="contained"
          disabled={disableBtn}
          sx={{ width: '190px', height: '40px' }}
          onClick={() =>
            history.push(
              resolvePathVariables(ROUTES.PARTY_DASHBOARD.path, {
                institutionId: selectedParty?.institutionId ?? '',
              })
            )
          }
        >
          Entra
        </Button>
      </Grid>
    </Grid>
  );
}
