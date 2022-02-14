import { Link, Grid, Typography } from '@mui/material';
import { Party } from '../../../model/Party';
import { ProductRole } from '../../../model/ProductRole';

type Props = {
  showActions: boolean;
  party: Party;
  productRoles: Array<ProductRole>;
};
export default function UserProductActions({ showActions, party, productRoles}:Props) {
  return (
    <>
    {showActions && 
    <Grid container item>
      <Grid item xs={6}>
        <Link>
          <Typography variant="h3" sx={{ fontSize: '16px', color:'#0073E6' }}>
          {party?.status === 'SUSPENDED' ? 'Riabilita' : party?.status === 'ACTIVE' ? 'Sospendi' : ''} 
          </Typography>
        </Link>
      </Grid>
      {productRoles.length > 1 && <Grid item xs={6}>
        <Link>
          <Typography variant="h3" sx={{ fontSize: '16px', color:'#0073E6' }}>
            Elimina
          </Typography>
        </Link>
      </Grid>}
    </Grid>}
    </>
  );
}
