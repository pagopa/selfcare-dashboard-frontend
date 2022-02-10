import { Link, Grid, Typography } from '@mui/material';

type Props = {
  showActions: boolean;
};
export default function UserProductActions({ showActions }:Props) {
  return (
    <>
    {showActions && 
    <Grid container item>
      <Grid item xs={6}>
        <Link>
          <Typography variant="h3" sx={{ fontSize: '16px', color:'#0073E6' }}>
            Sospendi
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
