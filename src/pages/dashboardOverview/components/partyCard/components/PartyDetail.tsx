import { Grid, Tooltip, Typography, useTheme } from '@mui/material';
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
          <Tooltip title={party.typology}>
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {party.typology}
            </Typography>
          </Tooltip>
        </Grid>
        {/* Area di competenza */}
        {party.category && (
          <>
            <Grid item xs={4}>
              <Typography variant="body2" sx={{ ...labelStyles }}>
                {t('overview.partyDetail.category')}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Tooltip title={party.category}>
                <Typography
                  sx={{ ...infoStyles, maxWidth: '100% !important' }}
                  className="ShowDots"
                >
                  {party.category}
                </Typography>
              </Tooltip>
            </Grid>
          </>
        )}
        {/* ragione sociale */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.companyName')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Tooltip title={party.description}>
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {party.description}
            </Typography>
          </Tooltip>
        </Grid>
        {/* codice IPA */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.ipaCode')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Tooltip title={party.institutionId}>
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {party.institutionId}
            </Typography>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container item xs={6} spacing={1}>
        {/* codice fiscale */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.fiscalCode')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Tooltip title={party.fiscalCode}>
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {party.fiscalCode}
            </Typography>
          </Tooltip>
        </Grid>
        {/* indirizzo PEC primario */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.pec')}
          </Typography>
        </Grid>
        <Grid item xs={8} sx={{}}>
          <Tooltip title={party.digitalAddress}>
            <Typography
              sx={{ ...infoStyles, maxWidth: '100% !important' }}
              className="ShowDots"
              title={party.digitalAddress}
            >
              {party.digitalAddress}
            </Typography>
          </Tooltip>
        </Grid>
        {/* sede legale  */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.registeredOffice')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Tooltip title={party.registeredOffice}>
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {party.registeredOffice}
            </Typography>
          </Tooltip>
        </Grid>
        {/* codice destinatario */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.recipientCode')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Tooltip title="TODO CODICE DESTINATARIO">
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              TODO CODICE DESTINATARIO
            </Typography>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
}
