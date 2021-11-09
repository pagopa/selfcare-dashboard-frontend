import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

type Props = {
  bodyTitle: string;
  bodyDescription: string;
};
export default function PartySelectionTitle({ bodyTitle, bodyDescription }: Props) {
  return (
    <Grid display="flex" justifyContent="center" container direction="column">
      <Grid item xs={4}>
        <Box>
          <Typography variant="h3" component="h2" sx={{ color: '#17324D' }}>
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
