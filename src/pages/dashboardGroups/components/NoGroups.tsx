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
        padding: 2,
        backgroundColor: 'white',
      }}
      justifyContent="center"
    >
      <Typography>Non è ancora stato creato alcun Gruppo.</Typography>
      <AddGroupButton party={party} />
    </Grid>
  );
}
