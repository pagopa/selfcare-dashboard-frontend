import { Grid, Link, Typography, Box } from '@mui/material';
// import Chip from '@mui/material/Chip';
import { InfoOutlined } from '@mui/icons-material';
import { Trans, useTranslation } from 'react-i18next';
import { Party } from '../../../../../model/Party';

type Props = {
  party: Party;
  canUploadLogo: boolean;
};

export default function PartyDetail({ party, canUploadLogo }: Props) {
  const { t } = useTranslation();
  return (
    <Grid container direction="column" alignItems={'flex-start'}>
      {/* <Grid item> // TODO chiedere se presente la chip, da prototipo non c'è
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
      </Grid> */}
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
          {t('overview.partyDetail.ipaCode')}
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
          {t('overview.partyDetail.companyName')}
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
          {t('overview.partyDetail.fiscalCode')}
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
          {t('overview.partyDetail.pec')}
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
            <Trans i18nKey="overview.partyDetail.contactToModify" shouldUnescape>
              <Typography variant="body2" sx={{ fontSize: '12px' }}>
                Per modificare questi dati,&nbsp;
                <Link href="https://indicepa.gov.it/ipa-portale/contatti">contatta</Link>
                &nbsp;l&apos;Indice della Pubblica Amministrazione (IPA)
              </Typography>
            </Trans>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
