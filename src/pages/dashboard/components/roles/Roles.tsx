import { Card, Grid, Typography } from '@mui/material';
import { Product } from '../../../../model/Product';
import RolesSearch from './components/rolesSearch/RolesSearch';

interface Roles {
  products: Array<Product>;
}

export default function Roles({ products }: Roles) {
  const selectedProduct = undefined;
  return (
    <Card
      variant="outlined"
      sx={{ width: '100%',height:'100%', boxShadow: '0px 0px 80px rgba(0, 43, 85, 0.1)', py: 5 }}
    >
      <Grid container alignItems={'center'} px={0}>
        <Grid item xs={12}>
          <Typography>Ruoli</Typography>
          {/*    <PartyDetail party={party} /> */}
        </Grid>
        <Grid item xs={12}>
          <RolesSearch selectedProduct={selectedProduct} products={products} />
        </Grid>
      </Grid>
    </Card>
  );
}
