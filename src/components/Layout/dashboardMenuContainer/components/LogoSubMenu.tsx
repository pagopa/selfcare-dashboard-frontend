import React from 'react';
import { Grid, Box, Avatar, Typography } from '@mui/material';
type Props = {
  urlLogo?: string;
  title: string;
  subTitle?: string;
};
export default function LogoSubMenu({ urlLogo, title, subTitle }: Props) {
  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={3}>
          <Box px={1} >
            <Avatar alt="" src={urlLogo} />
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Grid container direction="column">
            <Grid item xs={12} mb={0.5}>
              <Typography variant="h6" sx={{ fontWeight: '700' }}>
                {title}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5" sx={{ fontSize: '14px' }}>
                {subTitle}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
