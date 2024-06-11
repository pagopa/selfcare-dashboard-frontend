import { InfoOutlined } from '@mui/icons-material';
import { Grid, Typography, useTheme } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { Trans, useTranslation } from 'react-i18next';

export const DashboardInfoBanner = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Grid
      display="flex"
      alignItems="center"
      sx={{
        borderRadius: theme.shape,
        borderLeft: '4px solid #6BCFFB',
        backgroundColor: 'background.paper',
      }}
      p={2}
    >
      <Grid item xs={1} mr={2}>
        <InfoOutlined sx={{ width: '22px', height: '22px', mx: 1, color: '#6BCFFB' }} />
      </Grid>
      <Grid display={'flex'} flexWrap={'wrap'}>
        <Trans i18nKey="overview.partyDetail.contactToModify" shouldUnescape>
          <Typography fontSize={'14px'}>
            Alcuni dati non sono modificabili da questa sezione. Per farlo, vai al sito
            dell&apos;Indice della Pubblica Amministrazione (IPA)
          </Typography>
        </Trans>

        <ButtonNaked
          component="a"
          sx={{
            textDecoration: 'none !important',
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: '16px',
          }}
          href="https://indicepa.gov.it/ipa-portale/contatti"
        >
          {t('overview.partyDetail.goToIPA')}
        </ButtonNaked>
      </Grid>
    </Grid>
  );
};
