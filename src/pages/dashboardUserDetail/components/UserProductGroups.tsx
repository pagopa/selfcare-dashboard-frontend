import { Grid, Typography } from '@mui/material';

export default function UserProductGroups() {
  return (
    <Grid container>
      <Grid item xs={3}>
        <Typography className="CustomLabelStyle" variant="h6">
          GRUPPO
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <Typography variant="h6" className="CustomInfoStyle">
          TODO
        </Typography>
      </Grid>
    </Grid>
  );
}
