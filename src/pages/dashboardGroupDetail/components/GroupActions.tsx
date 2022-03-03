import { Button, Grid } from '@mui/material';

export default function GroupActions() {
  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Button
          variant="contained"
          sx={{ height: '40px', width: '100%' }}
          // onClick={() => window.location.assign(ENV.URL_FE.LOGOUT)} TODO: add path to EditGroupPage
        >
          Modifica
        </Button>
      </Grid>
      <Grid item xs={3}>
        <Button
          variant="contained"
          sx={{ height: '40px', width: '100%' }}
          //   onClick={() => window.location.assign(ENV.URL_FE.LOGOUT)}
        >
          Sospendi
        </Button>
      </Grid>
      <Grid item xs={3}>
        <Button
          variant="contained"
          sx={{ height: '40px', width: '100%' }}
          //   onClick={() => window.location.assign(ENV.URL_FE.LOGOUT)}
        >
          Duplica
        </Button>
      </Grid>
      <Grid item xs={3}>
        <Button
          variant="outlined"
          color="error"
          sx={{ height: '40px', width: '100%' }}
          // onClick={() => window.location.assign(ENV.URL_FE.LOGOUT)} TODO: add path to DuplicateGroupPage
        >
          Elimina
        </Button>
      </Grid>
    </Grid>
  );
}
