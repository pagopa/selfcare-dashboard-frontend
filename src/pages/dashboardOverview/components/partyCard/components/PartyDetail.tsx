import { Grid, Tooltip, Typography, useTheme } from '@mui/material';
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

  const institutionTypeTransoce = (institutionType: any) =>
    t(`overview.partyDetail.institutionTypeValue.${institutionType}`);
  const showTooltipAfter = 49;

  return (
    <Grid container alignItems={'flex-start'} wrap="nowrap">
      <Grid container item xs={6} alignItems={'flex-start'} spacing={1} pr={2}>
        {/* institutionType */}
        <Grid item xs={4}>
          <Typography variant="body2" sx={{ ...labelStyles }}>
            {t('overview.partyDetail.institutionType')}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Tooltip
            title={
              institutionTypeTransoce(party.institutionType).length >= showTooltipAfter
                ? institutionTypeTransoce(party.institutionType)
                : ''
            }
            placement="top"
            arrow={true}
          >
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {institutionTypeTransoce(party.institutionType)}
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
              <Tooltip
                title={party.category.length >= showTooltipAfter ? party.category : ''}
                placement="top"
                arrow={true}
              >
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
          <Tooltip
            title={party.description.length >= showTooltipAfter ? party.description : ''}
            placement="top"
            arrow={true}
          >
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
          <Tooltip
            title={party.originId.length >= showTooltipAfter ? party.originId : ''}
            placement="top"
            arrow={true}
          >
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
          <Tooltip
            title={party.fiscalCode.length >= showTooltipAfter ? party.fiscalCode : ''}
            placement="top"
            arrow={true}
          >
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
          <Tooltip
            title={party.digitalAddress.length >= showTooltipAfter ? party.digitalAddress : ''}
            placement="top"
            arrow={true}
          >
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
          <Tooltip
            title={party.registeredOffice.length >= showTooltipAfter ? party.registeredOffice : ''}
            placement="top"
            arrow={true}
          >
            <Typography sx={{ ...infoStyles, maxWidth: '100% !important' }} className="ShowDots">
              {party.registeredOffice}
            </Typography>
          </Tooltip>
        </Grid>
        {/* TODO  codice destinatario */}
        {/* <Grid item xs={4}>
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
        </Grid> */}
      </Grid>
    </Grid>
  );
}
