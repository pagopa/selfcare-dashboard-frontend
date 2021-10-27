import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';

 type Props = {
    bodyTitle: string;
    bodyDescription: string;
 };
export default function PartySelectionTitle({bodyTitle,bodyDescription}: Props) {
    return (
        <React.Fragment> 
            <Grid item xs={12}>
            <Box>
            <Typography variant="h3" component="h2" sx={{ color: '#17324D' }}>
                {bodyTitle}
            </Typography>
            </Box>
        </Grid>
        <Grid item xs={12}>
            <Box>
            <Typography variant="subtitle2" component="h2">
                {bodyDescription}
            </Typography>
            </Box>
        </Grid>
      </React.Fragment>
    );
}
