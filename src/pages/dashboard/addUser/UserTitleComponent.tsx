import { Grid, Typography } from '@mui/material';

type Props = {
  title?: string;
  subTitle?: string;
};
export default function UserTitleComponent({ title, subTitle }: Props) {
  return (
    <Grid container>
      <Grid item xs={12} mb={2}>
        <Typography variant="h1" sx={{ color: 'text.primary' }}>
          {title}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5" sx={{ color: 'text.primary' }}>
          {subTitle}
        </Typography>
      </Grid>
    </Grid>
  );
}
