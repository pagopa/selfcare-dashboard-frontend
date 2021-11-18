import React from 'react';
import { CardContent, Typography, Button, CardActions, Box, Grid, Badge } from '@mui/material';

type Props = {
  cardTitle: string;
  cardSubTitle?: string;
  buttonLabel: string;
  disableBtn: boolean;
  logoCard?: string;
  tag?: string;
  btnAction?: () => void;
  customHeight?: string;
};

export default function BaseProductCard({
  cardTitle,
  cardSubTitle,
  buttonLabel,
  disableBtn,
  logoCard,
  tag,
  customHeight,
  btnAction,
}: Props) {
  return (
    <React.Fragment>
      <CardContent sx={{ padding: 0 }}>
        {/* TODO: to verify if is a direct img or an url */}
        <Grid container>
          <Grid item xs={6}>
            <Box sx={{ width: '100%', height: '100%' }} mb={3}>
              <img src={`data:image/png;base64,${logoCard}`} />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Badge badgeContent={tag} color="primary" sx={{ minWidth: '113px' }} />
          </Grid>
        </Grid>
        <Typography variant="h2" sx={{ color: '#17324D' }} mb={2}>
          {cardTitle}
        </Typography>

        <Box sx={{ height: customHeight }}>
          <Typography variant="body2" sx={{ fontSize: '18px' }} mb={4}>
            {cardSubTitle}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ padding: 0 }}>
        <Grid container mb={2}>
          <Grid item xs={12}>
            <Button
              onClick={btnAction}
              disabled={disableBtn}
              variant="contained"
              sx={{ width: '100%', height: '48px' }}
            >
              {buttonLabel}
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </React.Fragment>
  );
}
