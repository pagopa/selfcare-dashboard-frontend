import { Grid, Typography } from '@mui/material';
import { Party } from '../../../model/Party';
import AddGroupButton from './AddGroupButton';

type Props = {
  party: Party;
};

export default function NoGroups({ party }: Props) {
  return (
    <Grid
      container
      direction="row"
      sx={{
        mt: 7,
        padding: 5,
        backgroundColor: 'white',
      }}
      justifyContent="center"
    >
      <Grid item xs={12} textAlign="center">
        <Typography variant="body2">Non è ancora stato creato alcun Gruppo.</Typography>
      </Grid>
      <Grid item xs={12} textAlign="center" mt={2}>
        <AddGroupButton party={party} />
      </Grid>
    </Grid>
  );
}
