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
        boxShadow:
          '0px 1px 10px 0px #002B551A, 0px 4px 5px 0px #002B550D, 0px 2px 4px -1px #002B551A',
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
