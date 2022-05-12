import React from 'react';
import { Grid, Box, Typography, useTheme } from '@mui/material';
import { PartyAvatar } from '@pagopa/mui-italia/dist/components/PartyAvatar';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';

type Props = {
  title: string;
  subTitle?: string;
  color?: string;
};

export default function LogoSubMenu({ title, subTitle, color }: Props) {
  const urlLogo = useAppSelector(partiesSelectors.selectPartySelectedLogo);
  const theme = useTheme();

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={3}>
          <Box>
            <PartyAvatar customSrc={urlLogo} id="partyLogo" customAlt={undefined} />
          </Box>
        </Grid>
        <Grid item xs={9}>
          <Grid container direction="column">
            <Grid item xs={12}>
              <Typography
                sx={{
                  fontWeight: theme.typography.fontWeightBold,
                  fonstSize: theme.typography.fontSize,
                  color: `${color} !important`,
                }}
              >
                {title}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="caption" sx={{ fontSize: '14px', color: `${color} !important` }}>
                {subTitle}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
