import { Grid, Typography } from '@mui/material';
// import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../../model/Party';

type Props = {
  party: Party;
};

export default function PartyDetail({ party }: Props) {
  const { t } = useTranslation();
  return (
    <Grid container alignItems={'flex-start'}>
      <Grid container item xs={6} alignItems={'flex-start'} spacing={1}>
        {/* tipologia */}
        <Grid item xs={4}>
          <Typography
            variant="body2"
            display="inline"
            sx={{
              color: 'text.disabled',
              fontWeight: 'normal',
              lineHeight: '28px',
            }}
          >
            {t('overview.partyDetail.typology')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h6">
            {party.typology} {party.category && `· ${party.category}`}
          </Typography>
        </Grid>
        {/* ragione sociale */}
        <Grid item xs={4}>
          <Typography
            variant="body2"
            display="inline"
            sx={{
              color: 'text.disabled',
              fontWeight: 'normal',
              lineHeight: '28px',
            }}
          >
            {t('overview.partyDetail.companyName')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography
            variant="h6"
            display="inline"
            sx={{
              color: '#000000',
              lineHeight: '28px',
            }}
          >
            {party.description}
          </Typography>
        </Grid>
        {/* codice IPA */}
        <Grid item xs={4}>
          <Typography
            variant="body2"
            display="inline"
            sx={{
              color: 'text.disabled',
              fontWeight: 'normal',
              lineHeight: '28px',
            }}
          >
            {t('overview.partyDetail.ipaCode')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography
            variant="h6"
            display="inline"
            sx={{
              color: '#000000',
              lineHeight: '28px',
            }}
          >
            {party.institutionId}
          </Typography>
        </Grid>
        {/* codice fiscale */}
        <Grid item xs={4}>
          <Typography
            variant="body2"
            display="inline"
            sx={{
              color: 'text.disabled',
              fontWeight: 'normal',
              lineHeight: '28px',
            }}
          >
            {t('overview.partyDetail.fiscalCode')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography
            variant="h6"
            display="inline"
            sx={{
              color: '#000000',
              lineHeight: '28px',
            }}
          >
            {party.fiscalCode}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item xs={6} spacing={1}>
        {/* indirizzo PEC primario */}
        <Grid item xs={4}>
          <Typography
            variant="body2"
            display="inline"
            sx={{
              color: 'text.disabled',
              fontWeight: 'normal',
              lineHeight: '28px',
            }}
          >
            {t('overview.partyDetail.pec')}
          </Typography>
        </Grid>
        <Grid item xs={8} width="100%" className="ShowDots">
          <Typography
            variant="h6"
            display="inline"
            sx={{
              color: '#000000',
              lineHeight: '28px',
            }}
          >
            {party.digitalAddress}
          </Typography>
        </Grid>
        {/* sede legale  */}
        <Grid item xs={4}>
          <Typography
            variant="body2"
            display="inline"
            sx={{
              color: 'text.disabled',
              fontWeight: 'normal',
              lineHeight: '28px',
            }}
          >
            {t('overview.partyDetail.registeredOffice')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h6">{party.registeredOffice}</Typography>
        </Grid>
        {/* codice destinatario */}
        <Grid item xs={4}>
          <Typography
            variant="body2"
            display="inline"
            sx={{
              color: 'text.disabled',
              fontWeight: 'normal',
              lineHeight: '28px',
            }}
          >
            {t('overview.partyDetail.recipientCode')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="h6">TODO CODICE DESTINATARIO</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
