import { Grid, Link, Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import { InfoOutlined } from '@mui/icons-material';
import { Box } from '@mui/system';
import { Party } from '../../../../../model/Party';

type Props = {
  party: Party;
  canUploadLogo: boolean;
};

export default function PartyDetail({ party, canUploadLogo }: Props) {
  return (
    <Grid container direction="column" alignItems={'flex-start'}>
      <Grid item>
        {party.category && (
          <Chip
            label={party.category}
            variant="outlined"
            sx={{
              background: '#FCFDFF',
              border: '1px solid #E6E9F2',
              boxSizing: 'border-box',
              borderRadius: '12px',
            }}
          />
        )}
      </Grid>
      <Grid item sx={{ mt: '18px', mb: '24px' }}>
        <Typography variant="h1" component="h2">
          {party.description}
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          variant="body2"
          display="inline"
          sx={{
            color: 'text.disabled',
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
          {party.institutionId}
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          variant="body2"
          display="inline"
          sx={{
            color: 'text.disabled',
            fontWeight: 'normal',
            lineHeight: '28px',
            mt: 1,
          }}
        >
          {'Ragione sociale'}
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
            color: 'text.disabled',
            fontWeight: 'normal',
            lineHeight: '28px',
            mt: 1,
          }}
        >
          {'Codice fiscale'}
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
          {party.fiscalCode}
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          variant="body2"
          display="inline"
          sx={{
            color: 'text.disabled',
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
        {canUploadLogo && (
          <Box display="flex" alignItems="center" pt={3}>
            <InfoOutlined sx={{ width: '20px', height: '20spx', mr: '4px', color: '#5C6F82' }} />
            <Typography variant="body2" sx={{ fontSize: '12px' }}>
              Per modificare questi dati,&nbsp;
              <Link href="https://indicepa.gov.it/ipa-portale/contatti">contatta</Link>
              &nbsp;l&apos;Indice della Pubblica Amministrazione (IPA)
            </Typography>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
