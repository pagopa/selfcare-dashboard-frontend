import React from 'react';
import { Grid, Button, Typography,} from '@mui/material';
import { Box } from '@mui/system';
import { URL_FE_LANDING} from '../../utils/constants';

export default function NoParty() {
  const bodyTitle = 'Non risulta nessun Ente associato';
  const bodyDescription = 'Il tuo profilo non è associato a nessun ente.';
  const bodyDescription2 = 'In tal caso prova ad accedere in un secondo momento.';

  return (
    <React.Fragment>
      <Grid
        direction="column"
        container
        display="flex"
        justifyContent="center"
        spacing={2}
        my={'auto'}
        sx={{ textAlign: 'center' }}
      >
        <Grid item container justifyContent="center">
          <Grid item xs={4}>
            <Box>
              <Typography variant="h3" component="h2">
                {bodyTitle}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Grid item container justifyContent="center">
          <Grid item xs={4}>
            <Box>
              <Typography variant="subtitle2" component="h2">
                {bodyDescription}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" component="h2">
                {bodyDescription2}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={2} mt={4}>
          <Button
            variant="contained"
            sx={{ width: '190px', height: '40px' }}
            onClick={() => window.location.assign(URL_FE_LANDING)}
          >
            Torna al portale
          </Button>
        </Grid>
      </Grid> 
    </React.Fragment>
  );
}
