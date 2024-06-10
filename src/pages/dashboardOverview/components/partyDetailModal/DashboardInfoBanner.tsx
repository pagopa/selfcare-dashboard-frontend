import { Box, Typography, Link, useTheme } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { Trans } from 'react-i18next';

export const DashboardInfoBanner = () => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        borderRadius: theme.shape,
        borderLeft: '4px solid #6BCFFB',
        backgroundColor: 'background.paper',
      }}
      p={2}
    >
      <InfoOutlined sx={{ width: '20px', height: '20spx', mx: 1, color: '#6BCFFB' }} />
      <Trans i18nKey="overview.partyDetail.contactToModify" shouldUnescape>
        <Typography variant="body2">
          Alcuni dati non sono modificabili da questa sezione. Per farlo,
          <Link
            href="https://indicepa.gov.it/ipa-portale/contatti"
            sx={{ textDecoration: 'none !important', fontWeight: 'bold' }}
          >
            vai al sito
          </Link>
          dell&apos;Indice della Pubblica Amministrazione (IPA)
        </Typography>
      </Trans>
    </Box>
  );
};
