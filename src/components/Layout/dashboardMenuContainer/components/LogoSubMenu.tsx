import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import CustomAvatar from './../../../CustomAvatar';
type Props = {
  title: string;
  subTitle?: string;
};
export default function LogoSubMenu({ title, subTitle }: Props) {
  const urlLogo = useAppSelector(partiesSelectors.selectPartySelectedLogo);

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={3}>
          <Box px={1}>
            <CustomAvatar customAlt="" customSrc={urlLogo} />
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
