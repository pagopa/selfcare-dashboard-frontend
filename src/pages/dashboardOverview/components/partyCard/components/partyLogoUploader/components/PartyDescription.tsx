import { Grid, Link, Typography } from '@mui/material';
import { useTranslation, Trans } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { Box } from '@mui/system';

// Utility to wait some time

type Props = {
  labelLink: string;
  open:
    | React.MouseEventHandler<HTMLAnchorElement>
    | React.MouseEventHandler<HTMLSpanElement>
    | undefined;
  loading: boolean;
  files: Array<File>;
};

export function PartyDescription({ labelLink, open, loading, files }: Props) {
  const { t } = useTranslation();
  return (
    <Grid container justifyContent={'flex-start'} alignItems={'center'}>
      {!loading && <EditIcon color={'primary'} fontSize="small" />}
      <Box display="flex" alignItems="center" ml={1}>
        <Link
          color={'primary'}
          onClick={open}
          variant="caption"
          sx={{
            fontWeight: 'fontWeightMedium',
            cursor: 'pointer',
            textDecoration: 'none !important',
          }}
        >
          {files && files.length > 0 && files[0].name ? files[0].name : labelLink}
        </Link>
      </Box>
      <Typography
        mt={1}
        variant="body2"
        sx={{
          color: '#5C6F82',
          fontWeight: '400',
          lineHeight: '18px',
          fontSize: '14px',
          width: '100%',
        }}
      >
        {t('overview.partyLogo.size')}
      </Typography>
      <Typography
        mt={1}
        sx={{ fontSize: '12px', fontWeight: 'fontWeightRegular', color: 'text.secondary' }}
      >
        <Trans i18nKey="overview.partyLogo.info">
          Inserisci solo il logo del tuo ente.
          <br />
          Sarai responsabile dell’inserimento di immagini diverse da quella indicata.
        </Trans>
      </Typography>
    </Grid>
  );
}
