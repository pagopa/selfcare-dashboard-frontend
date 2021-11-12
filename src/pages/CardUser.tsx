import { Card, Grid, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import { Party } from '../model/Party';
import { FilePngUploader } from './FilePngUploader';

type Props = {
  party: Party;
};

export default function CardUser({ party }: Props) {
  return (
    <Card variant="outlined">
      <Grid container direction="row" justifyContent={'space-around'} alignItems={'center'}>
        <Grid item>
          <Grid container direction="column" alignItems={'flex-start'}>
            <Grid item>
              <Chip
                label={'Ente Locale'}
                variant="outlined"
                sx={{
                  background: '#FCFDFF',
                  border: '1px solid #E6E9F2',
                  boxSizing: 'border-box',
                  borderRadius: '12px',
                }}
              />
            </Grid>
            <Grid item sx={{ mt: '18px', mb: '24px' }}>
              <Typography variant="h1" component="h2" sx={{ color: '#17324D' }}>
                {party.description}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                display="inline"
                sx={{
                  color: '#475A6D',
                  fontWeight: 'normal',
                  lineHeight: '28px',
                }}
              >
                {'Codice IPA'}
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                sx={{
                  color: '#000000',
                  fontWeight: 'normal',
                  lineHeight: '28px',
                  marginLeft: 1,
                }}
              >
                {party.description}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                display="inline"
                sx={{
                  color: '#475A6D',
                  fontWeight: 'normal',
                  lineHeight: '28px',
                  mt: 1,
                }}
              >
                {'Ragione Sociale'}
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                sx={{
                  color: '#000000',
                  fontWeight: 'normal',
                  lineHeight: '28px',
                  marginLeft: 1,
                  mt: 1,
                }}
              >
                {party.description}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                display="inline"
                sx={{
                  color: '#475A6D',
                  fontWeight: 'normal',
                  lineHeight: '28px',
                  mt: 1,
                }}
              >
                {'Codice Fiscale'}
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                sx={{
                  color: '#000000',
                  fontWeight: 'normal',
                  lineHeight: '28px',
                  marginLeft: 1,
                  mt: 1,
                }}
              >
                {party.description}
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="body2"
                display="inline"
                sx={{
                  color: '#475A6D',
                  fontWeight: 'normal',
                  lineHeight: '28px',
                  mt: 1,
                }}
              >
                {'PEC'}
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                sx={{
                  color: '#000000',
                  fontWeight: 'normal',
                  lineHeight: '28px',
                  marginLeft: 1,
                  mt: 1,
                }}
              >
                {party.digitalAddress}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="column" alignItems={'flex-end'}>
            <Grid item>
              <FilePngUploader urlLogo={party.image} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}
