import { Card, Grid, Typography } from '@mui/material';
import RolesSearch from './components/rolesSearch/RolesSearch';

export default function Roles() {
  const selectedProduct = undefined;
  return (
    <Card
      variant="outlined"
      sx={{ width: '100%', boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)', py: 5 }}
    >
      <Grid container direction="column" alignItems={'center'} px={4}>
        <Grid item xs={9}>
          <Typography>Ruoli</Typography>
          {/*    <PartyDetail party={party} /> */}
        </Grid>
        <Grid item xs={12}>
          <RolesSearch selectedProduct={selectedProduct} />
        </Grid>
      </Grid>
    </Card>
  );
}
