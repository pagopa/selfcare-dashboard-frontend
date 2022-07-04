import { Grid, Typography, Box } from '@mui/material';

type Props = {
  bodyTitle: string;
  bodyDescription: string;
};
export default function PartySelectionTitle({ bodyTitle, bodyDescription }: Props) {
  return (
    <Grid display="flex" justifyContent="center" alignItems="center" container direction="column">
      <Grid item xs={4}>
        <Box>
          <Typography variant="h3" component="h2">
            {bodyTitle}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={8}>
        <Box>
          <Typography variant="subtitle2" component="h2">
            {bodyDescription}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
