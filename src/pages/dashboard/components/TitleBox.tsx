// import React from 'react'
// import { Box } from '@mui/material';
import { GridSize, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

type Props = {
  title: string;
  subTitle: string;
  mbTitle: GridSize;
  mtGrid: number;
  mbSubTitle:number;
  variantTitle: Variant ;
  variantSubTitle: Variant ;
};
export default function TitleBox({ title, subTitle,mbTitle,mtGrid,mbSubTitle,variantTitle,variantSubTitle }: Props) {
  return (
    <Grid container mt={mtGrid}>
      <Grid item xs={12} mb={mbTitle}>
        <Typography variant={variantTitle} sx={{ color: '#17324D'}}>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12} mb={mbSubTitle}>
        <Typography variant={variantSubTitle} sx={{ fontSize: '18px' }}>
          {subTitle}
        </Typography>
      </Grid>
    </Grid>
  );
}
