import React from 'react';
import { Grid, Button, Typography, Divider, Link } from '@mui/material';
import { Box } from '@mui/system';

export default function NoParty() {
  const bodyTitle = 'Non risulta nessun Ente associato';
  const bodyDescription = 'Il tuo profilo non è associato a nessun ente.';
  const bodyDescription2 = 'In tal caso prova ad accedere in un secondo momento.';
  const text ='Vuoi registrare un nuovo Ente?';
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
              <Typography variant="h3" component="h2" sx={{ color: '#17324D' }}>
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
            // TODO: redirect to landing
          >
            Torna al portale
          </Button>
        </Grid>

        <Grid item container justifyContent="center" mt={13}>
          <Grid item xs={4}>
           <Divider sx={{border:'1px solid #CCD4DC;'}}/>
          </Grid>
        </Grid>

        <Grid item container justifyContent="center">
          <Grid item xs={4}>
            <Box>
              <Typography variant="h5" sx={{ fontSize:'14px' }}>
              {/* TODO: redirect to onboarding */}
                {text} <Link>Aderisci</Link>
              </Typography>
              
            </Box>
          </Grid>
        </Grid>

      </Grid>
    </React.Fragment>
  );
}
