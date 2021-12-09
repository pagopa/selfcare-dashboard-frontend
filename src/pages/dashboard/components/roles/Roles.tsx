import {  Grid, Typography } from '@mui/material';
import RolesSearch from './components/rolesSearch/RolesSearch';

export default function Roles() {
  const selectedProduct = undefined;
  return (
    // <Card
    //   variant="outlined"
    //   sx={{ width: '100%',height:'100%', boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)', py: 5 }}
    // >

      <Grid container alignItems={'center'} px={0} sx={{width:'953px', backgroundColor:'transparent !important'}} >
        <Grid item xs={12}>
          <Typography>Ruoli</Typography>
          {/*    <PartyDetail party={party} /> */}
        </Grid>
        <Grid item xs={12}>
          <RolesSearch selectedProduct={selectedProduct} />
        </Grid>
      </Grid>

    // </Card>
  );
}
