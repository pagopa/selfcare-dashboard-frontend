import { Grid, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
      <Box display="flex" alignItems="center">
        <Link
          color={'primary'}
          onClick={open}
          sx={{
            fontSize: '14px',
            fontWeight: 'fontWeightMedium',
            cursor: 'pointer',
            textDecoration: 'none !important',
          }}
        >
          {files && files.length > 0 && files[0].name ? files[0].name : labelLink}
        </Link>
      </Box>
      <Typography
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
    </Grid>
  );
}
