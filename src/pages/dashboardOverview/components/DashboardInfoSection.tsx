import { Box, Typography, Link } from '@mui/material';
import { InfoOutlined } from '@mui/icons-material';
import { Trans } from 'react-i18next';

export default function DashboardInfoSection() {
  return (
    <Box
      display="flex"
      alignItems="center"
      height="48px"
      sx={{ borderRadius: '4px', borderLeft: '4px solid #6BCFFB', backgroundColor: '#FFFFFF' }}
    >
      <InfoOutlined sx={{ width: '20px', height: '20spx', mx: 1, color: '#6BCFFB' }} />
      <Trans i18nKey="overview.partyDetail.contactToModify" shouldUnescape>
        <Typography variant="body2" sx={{ fontSize: '12px' }}>
          Vuoi modificare questi dati?
          <Link
            href="https://indicepa.gov.it/ipa-portale/contatti"
            sx={{ textDecoration: 'none !important', fontWeight: 'bold' }}
          >
            Vai al sito
          </Link>
          dell&apos;Indice della Pubblica Amministrazione (IPA)
        </Typography>
      </Trans>
    </Box>
  );
}
