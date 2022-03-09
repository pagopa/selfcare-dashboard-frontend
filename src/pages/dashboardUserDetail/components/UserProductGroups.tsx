import { Grid, styled, Typography } from '@mui/material';

const CustomLabelStyle = styled(Typography)({
  fontSize: '14px',
  color: '#5C6F82',
});

export default function UserProductGroups() {
  return (
    <Grid container>
      <Grid item xs={3}>
        <CustomLabelStyle variant="h6" className="labelStyle">
          GRUPPO
        </CustomLabelStyle>
      </Grid>
      <Grid item xs={9}>
        <CustomLabelStyle variant="h6" className="labelStyle">
          GRUPPO
        </CustomLabelStyle>
      </Grid>
    </Grid>
  );
}
