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
        {/* institutionType */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.institutionType')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Tooltip title={party.institutionType ? party.institutionType : ''}>
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {party.institutionType}
            </Typography>
          </Tooltip>
        </Grid>
        {/* Categoria */}
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
        {/* origin */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.originId')}&nbsp;{party.origin}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Tooltip title={party.originId}>
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {party.originId}
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
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
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
