import { Grid, Typography } from '@mui/material';

type Props = {
  title?: string;
  subTitle?: string;
  productName?: string;
  color?: string;
};
export default function UserTitleComponent({ title, subTitle, productName, color }: Props) {
  return (
    <Grid container>
      <Grid item xs={12} mb={2}>
        <Typography variant="h1" sx={{color}}>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" sx={{color}}>
          {subTitle}{productName}
        </Typography>
      </Grid>
    </Grid>
  );
}
