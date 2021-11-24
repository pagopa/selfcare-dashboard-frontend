import { Grid, Typography } from '@mui/material';
import React from 'react';

type Props = {
  title?: string;
  subTitle?: string;
  productName?: string;
};
export default function UserTitleComponent({ title, subTitle, productName }: Props) {
  return (
    <React.Fragment>
      <Grid container direction="column">
        <Grid item xs={12}>
          <Typography >{title}</Typography>{' '}
        </Grid>
        <Grid item xs={12}>
          <Typography>
            {subTitle}
            {productName}
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
