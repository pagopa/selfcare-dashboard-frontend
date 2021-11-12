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
  const bodyTitle = "Seleziona l'Ente per cui accedi";
  const bodyDescription =
    "Potrai in ogni momento cambiare Ente/ruolo anche all'interno dell'interfaccia di gestione dei prodotti";

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
        <Grid container xs={3}>
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
