import React from 'react';
import { Typography, Button, Box, Grid, Badge, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

type Props = {
  cardTitle: string;
  cardSubTitle?: string;
  buttonLabel: string;
  disableBtn: boolean;
  logoCard?: string;
  tag?: string;
  btnAction?: () => void;
};

const CustomBadge = styled(Badge)({
  '.MuiBadge-badge': {
    backgroundColor: '#00C5CA',
    color: '#17324D',
    fontWeight: '600',
  },
});

export default function BaseProductCard({
  cardTitle,
  cardSubTitle,
  buttonLabel,
  disableBtn,
  logoCard,
  tag,
  btnAction,
}: Props) {
  return (
    <React.Fragment>
      <Card sx={{ border: 'none', boxShadow: 'none' }}>
        <CardContent>
          {/* TODO: to verify if is a direct img or an url */}
          <Grid container >
            <Grid item xs={6} mb={3}>
              <Box sx={{ width: '100%', height: '50px' }}>
                <img src={`data:image/png;base64,${logoCard}`} />
              </Box>
            </Grid>
            {tag && (
              <Grid item xs={6}>
                <CustomBadge badgeContent={tag} sx={{ minWidth: '113px' }} />
              </Grid>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ height: '80px' }} display='flex' alignItems={'center'}>
              <Typography variant="h2" sx={{ color: '#17324D' }}>
                {cardTitle}
              </Typography>
            </Box>
          </Grid>
          {cardSubTitle && <Grid item xs={12} mb={2}>
            <Box sx={{ height: '80px' }} display='flex' alignItems={'center'}>
              <Typography variant="body2" sx={{ fontSize: '18px' }}>
                {cardSubTitle}
              </Typography>
            </Box>
          </Grid>}

          <Grid item xs={12} justifyContent="center">
            <Box sx={{ height: '45px', width: '100%'}}>
              <Button
                onClick={btnAction}
                disabled={disableBtn}
                variant="contained"
                sx={{ width: '100%', height: '48px' }}
              >
                {buttonLabel}
              </Button>
            </Box>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
