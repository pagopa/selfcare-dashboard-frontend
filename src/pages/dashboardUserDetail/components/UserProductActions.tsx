import { Link, Grid, Typography } from '@mui/material';
import { Party } from '../../../model/Party';

type Props = {
  showActions: boolean;
  party: Party;
};
export default function UserProductActions({ showActions, party }:Props) {
  return (
    <>
    {showActions && 
    <Grid container item>
      <Grid item xs={6}>
        <Link>
          <Typography variant="h3" sx={{ fontSize: '16px', color:'#0073E6' }}>
          {party?.status === 'ACTIVE' ? 'Sospendi' : 'Riabilita'}
          </Typography>
        </Link>
      </Grid>
      <Grid item xs={6}>
        <Link>
          <Typography variant="h3" sx={{ fontSize: '16px', color:'#0073E6' }}>
            Elimina
          </Typography>
        </Link>
      </Grid>
    </Grid>}
    </>
  );
}
