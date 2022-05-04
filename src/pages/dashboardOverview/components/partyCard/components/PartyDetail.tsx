import { Grid, Typography, useTheme } from '@mui/material';
// import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../../../model/Party';

type Props = {
  party: Party;
};
const labelStyles = {
  color: 'text.colorTextPrimary',
};

export default function PartyDetail({ party }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const infoStyles = {
    fontWeight: theme.typography.fontWeightMedium,
    fontSize: theme.typography.fontSize,
  };
  return (
    <Grid container alignItems={'flex-start'}>
      <Grid container item xs={6} alignItems={'flex-start'} spacing={1}>
        {/* tipologia */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.typology')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography
            title={`${party.typology} · ${party.category}`}
            sx={{ ...infoStyles, maxWidth: '100% !important' }}
            className="ShowDots"
          >
            {party.typology} {party.category && `· ${party.category}`}
          </Typography>
        </Grid>
        {/* ragione sociale */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.companyName')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
            {party.description}
          </Typography>
        </Grid>
        {/* codice IPA */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.ipaCode')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
            {party.institutionId}
          </Typography>
        </Grid>
        {/* codice fiscale */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.fiscalCode')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
            {party.fiscalCode}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item xs={6} spacing={1}>
        {/* indirizzo PEC primario */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.pec')}
          </Typography>
        </Grid>
        <Grid item xs={8} sx={{}}>
          <Typography
            sx={{ ...infoStyles, maxWidth: '100% !important' }}
            className="ShowDots"
            title={party.digitalAddress}
          >
            {party.digitalAddress}
          </Typography>
        </Grid>
        {/* sede legale  */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.registeredOffice')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
            {party.registeredOffice}
          </Typography>
        </Grid>
        {/* codice destinatario */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.recipientCode')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
            TODO CODICE DESTINATARIO
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
