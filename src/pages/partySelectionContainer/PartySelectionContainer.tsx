import { Grid } from '@mui/material';
import withParties from '../../decorators/withParties';
import { useAppSelector } from '../../redux/hooks';
import { partiesSelectors } from '../../redux/slices/partiesSlice';
import NoActiveParty from './NoActiveParty';
import NoParty from './NoParty';
import PartySelection from './partySelection/PartySelection';

const PartySelectionContainer = () => {
  const parties = useAppSelector(partiesSelectors.selectPartiesList);

  // se esiste almeno un party attivo visualizzo PartySelection
  // altrimenti se esiste almeno un elemento visualizzo NoActiveParty --<PartyItemContainer />
  // NoParty
  return !parties ? (
    <></>
  ) : (
    <Grid item xs={12} pb={16}>
      {parties.filter((party) => party.status === 'ACTIVE').length >= 1 ? (
        <PartySelection parties={parties} />
      ) : parties.filter((party) => party.status === 'PENDING').length >= 1 ? (
        <NoActiveParty parties={parties} />
      ) : (
        parties.length === 0 && <NoParty />
      )}
    </Grid>
  );
};

export default withParties(PartySelectionContainer);
